'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Package, AlertTriangle, TrendingUp, DollarSign, Shirt, Tag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockCount: 0,
    totalQuantity: 0,
  });
  const [movements, setMovements] = useState<any[]>([]);
  const [sizeDistribution, setSizeDistribution] = useState<any[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<any[]>([]);
  const [weeklyTrend, setWeeklyTrend] = useState<any[]>([]);
  const [stockBySize, setStockBySize] = useState<any[]>([]);
  const supabase = createClient();

  const getLast7Days = () => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      result.push({
        fullDate: d.toISOString().split('T')[0],
        label: days[d.getDay()],
      });
    }
    return result;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch products with sizes
        const { data: products } = await supabase
          .from('products')
          .select('*, product_sizes(size, quantity, reorder_level)');

        if (products) {
          let totalValue = 0;
          let lowStockCount = 0;
          let totalQuantity = 0;
          const sizeMap: Record<string, number> = { S: 0, M: 0, XL: 0, XXL: 0 };

          products.forEach((p: any) => {
            p.product_sizes?.forEach((ps: any) => {
              totalValue += ps.quantity * p.unit_price;
              totalQuantity += ps.quantity;
              sizeMap[ps.size] = (sizeMap[ps.size] || 0) + ps.quantity;
              if (ps.quantity <= ps.reorder_level) {
                lowStockCount++;
              }
            });
          });

          setStats({
            totalProducts: products.length,
            totalValue: totalValue,
            lowStockCount: lowStockCount,
            totalQuantity: totalQuantity,
          });

          // Size distribution
          setSizeDistribution(
            Object.entries(sizeMap).map(([size, qty]) => ({
              name: size,
              value: qty,
            }))
          );

          // Stock by size chart
          setStockBySize(
            Object.entries(sizeMap).map(([size, qty]) => ({
              taille: size,
              quantité: qty,
            }))
          );

          // Category distribution
          const categoryMap: Record<string, number> = {};
          products.forEach((p: any) => {
            const catName = p.categories?.name || 'Sans catégorie';
            categoryMap[catName] = (categoryMap[catName] || 0) + totalQuantity;
          });

          setCategoryDistribution(
            Object.entries(categoryMap).map(([cat, qty]) => ({
              name: cat,
              value: qty,
            }))
          );
        }

        // Fetch recent movements
        const { data: movementsData } = await supabase
          .from('stock_movements')
          .select(`
            id,
            type,
            quantity,
            size,
            created_at,
            products:product_id(name, sku)
          `)
          .order('created_at', { ascending: false })
          .limit(8);

        if (movementsData) {
          setMovements(movementsData);

          // Weekly trend
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

          const { data: weeklyData } = await supabase
            .from('stock_movements')
            .select('type, quantity, created_at')
            .gte('created_at', sevenDaysAgo.toISOString())
            .order('created_at', { ascending: true });

          if (weeklyData) {
            const last7Days = getLast7Days();
            const aggregated = last7Days.map((day) => {
              const dayMovements = weeklyData.filter((m) =>
                m.created_at.startsWith(day.fullDate)
              );
              const entries = dayMovements
                .filter((m) => m.type === 'entry')
                .reduce((sum, m) => sum + (m.quantity || 0), 0);
              const exits = dayMovements
                .filter((m) => m.type === 'exit')
                .reduce((sum, m) => sum + (m.quantity || 0), 0);
              return {
                date: day.label,
                entrées: entries,
                sorties: exits,
              };
            });
            setWeeklyTrend(aggregated);
          }
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [supabase]);

  return (
    <div className="p-6 space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">Gestion des stocks de vêtements</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Stock Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur du stock</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {(stats.totalValue / 1000000).toFixed(1)}M Ar
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Valeur totale de l&apos;inventaire
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Références en stock
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Quantity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quantité totale</CardTitle>
            <Shirt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalQuantity}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Unités en stock
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Low Stock */}
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock faible</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold text-orange-600">{stats.lowStockCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tailles à réapprovisionner
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Weekly Movements Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mouvements (7 jours)</CardTitle>
            <CardDescription>
              Entrées et sorties de stock
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <Skeleton className="h-72 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="entrées" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="sorties" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Chart 2: Stock by Size */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quantités par taille</CardTitle>
            <CardDescription>
              Distribution du stock
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <Skeleton className="h-72 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stockBySize}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="taille" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantité" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Chart 3: Size Distribution Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribution par taille</CardTitle>
            <CardDescription>
              Proportion du stock par taille
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <Skeleton className="h-72 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={sizeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sizeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Chart 4: Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Stock par catégorie</CardTitle>
            <CardDescription>
              Distribution par genre
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <Skeleton className="h-72 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activités récentes</CardTitle>
          <CardDescription>Derniers mouvements de stock</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))
            ) : movements.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun mouvement enregistré
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {movements.map((movement) => (
                  <div key={movement.id} className="flex gap-3 p-3 rounded-lg border">
                    <div>
                      <Badge
                        variant={movement.type === 'entry' ? 'default' : 'destructive'}
                        className="mb-2"
                      >
                        {movement.type === 'entry' ? 'Entrée' : 'Sortie'}
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {movement.products?.name || 'Produit inconnu'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {movement.products?.sku || ''} - Taille: {movement.size || 'N/A'}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(movement.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className={`text-xs font-semibold ${
                          movement.type === 'entry' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {movement.type === 'entry' ? '+' : '-'}{movement.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
