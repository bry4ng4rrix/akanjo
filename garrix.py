from datetime import datetime

nom = "Bryan Garrix"
age = 24

today = datetime.now()

valide_nom = True

for x in nom:
    if x not in "Bryan Garrix":
        valide_nom = False
        break
if (
    valide_nom
    and nom == "Bryan Garrix"
    and age == 24
    and today.day == 5
    and today.month == 5
):
    print("🎉 Joyeux anniversaire Bryan Garrix ! 🎂")
else:
    print("Conditions non remplies")
