/*-------------------
Projet Le Chat - Created by Lucas 
--------------------*/

document.getElementById('submitCat').addEventListener('click', function () {
    var choixDuChat = document.getElementById('choice').value;
    var raisonAdoption = document.getElementById('reason').value;
    if (choixDuChat !== "-- Sélectionnez --" && raisonAdoption.length >= 15) {
        document.getElementById('requestCat').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('failureMessage').style.display = 'none';
    } else {
        document.getElementById('failureMessage').style.display = 'block';
    }
});
