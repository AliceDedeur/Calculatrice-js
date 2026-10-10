// Lier le js au HTML - Sélectionner l'écran et les boutons
const ecran = document.getElementById('result');
const boutons = document.querySelectorAll('.btn');
const historiqueDiv = document.getElementById('historique');


// Créer les variables qui stockerons le calcul en cours
// tant que l'on appuie pas sur un operateur les chiffres se stockent dans premierNombre
let premierNombre = "";
let operateur = "";
let deuxiemeNombre = "";
// intérupteur permettant de passer du premierNombre au deuxiemeNombre qui est par defaut sur le premierNombre
let statutCalcul = false;
// interupteur indiquant si on a tapé ou non l'opérateur =
let calculTermine = false;

// Ecouter le clic sur chaque bouton
boutons.forEach(bouton => {
    bouton.addEventListener('click', (e) => {
        // dans le html chaque boutons à un data-value que js stock dans un dataset
        // e.target représente le bouton surlequel on clic 
        // e.target.dataset lit tous les attributs commençant par data-
        // e.target.dataset.value récupère la valeur spécifique attribuée au bouton en question
        const valeur = e.target.dataset.value;

        // 1. BOUTON C: si on clic sur "C" on éfface tout et sl'écran affiche 0
        if(valeur === 'C'){
            premierNombre ="";
            operateur = "";
            deuxiemeNombre = "";
            statutCalcul = false;
            ecran.innerText = "0";
        }
        // 2. BOUTON DELL: si on clic sur "DELL" et si on est sur le premierNombre on éfface le dernier caractère du nombre
        else if (valeur === 'DELL'){
            if (!statutCalcul){
                premierNombre = premierNombre.slice(0, -1);
                // si le nombre devient vide, on affiche "0"
                ecran.innerText = premierNombre === "" ? "0" : premierNombre;
            }else{
            // sinon (statutCalcul = true) on éfface le dernier caractère du deuxiemeNombre
            deuxiemeNombre = deuxiemeNombre.slice(0, -1);
            ecran.innerText = deuxiemeNombre === "" ? "0" : deuxiemeNombre;
            }  
        }

        // 3. BOUTON AU CARRE:
        else if(valeur === '**2'){
            if(!statutCalcul && premierNombre !== ""){
                let num = parseFloat(premierNombre);
                premierNombre = (num * num).toString();
                ecran.innerText = premierNombre;
            }else if(statutCalcul && deuxiemeNombre !== ""){
                let num = parseFloat(deuxiemeNombre);
                deuxiemeNombre = (num * num).toString();
                ecran.innerText = deuxiemeNombre;
            }            
        }

        // 4. BOUTON CHANGEMENT DE SIGNE (-/+)
        else if(valeur === '-/+'){
            if(!statutCalcul && premierNombre !== ""){
                let num = parseFloat(premierNombre);
                premierNombre = (num * -1).toString();
                ecran.innerText = premierNombre;
            }else if(statutCalcul && deuxiemeNombre !== ""){
                let num = parseFloat(deuxiemeNombre);
                deuxiemeNombre = (num * -1).toString();
                ecran.innerText = deuxiemeNombre;
            }
        }

        else if (valeur === '%') {
            if (!statutCalcul && premierNombre !== "") {
                let num = parseFloat(premierNombre);
                premierNombre = (num / 100).toString();
                ecran.innerText = premierNombre;
            } else if (statutCalcul && deuxiemeNombre !== "") {
                let num = parseFloat(deuxiemeNombre);
                deuxiemeNombre = (num / 100).toString();
                ecran.innerText = deuxiemeNombre;
            }
        }

        // 5. BOUTONS OPERATEURS: si on clic sur un de ces opérateur et si les variables ne sont pas vides on stocke dans les variable num1 et num 2 les valeurs de premier et deuxiemeNombre transformée en number acceptant les décimales. la variable interm stockera momentanément la valeur calculée avant qu'elle ne soit attibuée à premier ou deuxiemeNombre. elle est pour l'instant égale à 0
        else if (valeur === '+' || valeur === '-' || valeur === '*' || valeur === '/'){
            if(premierNombre !== "" && operateur !== "" && deuxiemeNombre !== ""){
                let num1 = parseFloat(premierNombre);
                let num2 = parseFloat(deuxiemeNombre);
                let interm = 0;
            

                // on fait les opération et on stocke le résultat dans la variable interm
                switch (operateur) {
                    case '+': 
                        interm = num1 + num2; 
                        break;
                    case '-':
                        interm = num1 - num2;
                        break;
                    case '*':
                        interm = num1 * num2;
                        break;
                    case '/':
                        interm = num1 / num2;
                        break;
                }

                // on fait passer la valeur interm vers premier et deuxiemeNombre en la retransformant en chaine de caractères
                premierNombre = interm.toString();
                deuxiemeNombre = "";
                ecran.innerText = premierNombre;
            }

            // si premierNombre est différent de vide et différent de erreur, l'opérateur prend la valeur tapée et statutCalcul (interupteur) passe à true, càd au deuxiemeNombre
            if (premierNombre !== "" && premierNombre !== "Erreur"){
                operateur = valeur;
                statutCalcul = true;
            }
        }

        // 6. BOUTON = : idem
        else if (valeur === '='){
            if(premierNombre !== "" && operateur !== "" && deuxiemeNombre !== ""){
                let num1 = parseFloat(premierNombre);
                let num2 = parseFloat(deuxiemeNombre);
                let resultat = 0;

                switch (operateur){
                    case '+':
                        resultat = num1 + num2;
                        break;
                    case '-':
                        resultat = num1 - num2;
                        break;
                    case '*':
                        resultat = num1 * num2;
                        break;
                    case '/':
                        resultat = num2 === 0? "Erreur" : num1 / num2;
                        break;
                }

                // on nettoyage l'opérateur pour l'affichage
                let opeAffichage = formaterOperateur(operateur);

                // on crée un nouveau paragraphe pour ce calcul
                const nouvelleLigne = document.createElement('p');
                nouvelleLigne.innerText = `${premierNombre} ${opeAffichage} ${deuxiemeNombre} = ${resultat}`;
                
                // on l'ajoute dans la zone d'historique
                historiqueDiv.appendChild(nouvelleLigne);

                // on limite à 10 lignes maximum
                // on récupère tous les paragraphes présents dans l'historique
                const lignes = historiqueDiv.querySelectorAll('p');
                if (lignes.length > 10) {
                    lignes[0].remove(); // supprimer le plus ancien (le premier de la liste)
                }

                ecran.innerText = resultat;
                premierNombre = resultat.toString();
                operateur = "";
                deuxiemeNombre = "";
                statutCalcul = false;
                calculTermine = true;
            }
        }

        // 7. LES CHIFFRES ET LE POINT
        else if((valeur >= '0' && valeur <= '9') || valeur === '.'){
            // si calcul précédent terminé, on efface tout pour le nouveau chiffre
            if(calculTermine){
                premierNombre = "";
                deuxiemeNombre = "";
                operateur = "";
                statutCalcul = false;
                calculTermine = false;
            }
            // pour le premierNombre
            if(!statutCalcul){
                // securité 1: si on tape un point et qu'il y en a déjà un, on ne fait rien
                if(valeur === '.' && premierNombre.includes('.')){
                    return; // arrête l'exécution du code pour ce clic
                }
                // sécurité 2: si le nombre est vide et qu'on tape le point, on commence par un 0
                if(premierNombre === "" && valeur === "."){
                    premierNombre = "0.";
                }
                // si l'écran affiche "0" et qu'on tape un chiffre (pas le point), on remplace le "0" par le chiffre
                else if (ecran.innerText === "0" && valeur !== "."){
                    premierNombre = valeur;
                }
                // sinon on ajoute le chiffre ou le point normalement
                else{
                    premierNombre += valeur;
                }
                ecran.innerText = premierNombre;
            }else{
                // pour le deuxiemeNombre
                // securité 1: idem
                if(valeur === '.' && deuxiemeNombre.includes('.')){
                    return;
                }
                // securité 2: idem + ici pas besoin de gérer le zéro initial de l'écran, on passe directement à l'ajout du chiffre ou du point
                if(deuxiemeNombre === "" && valeur === "."){
                    deuxiemeNombre = "0.";
                }else{
                    deuxiemeNombre += valeur;
                }
                ecran.innerText = deuxiemeNombre;
            }
        }
    })
})

function formaterOperateur(op) {
    if (op === '*') return '×';
    if (op === '/') return ':';
    return op; // Renvoie +, - ou autre tel quel
}