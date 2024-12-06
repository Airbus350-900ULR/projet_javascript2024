// URLs des fichiers JSON
const dataURLs = [
    { url: 'data/survey_results_WE.json', continent: 'europe' },
    { url: 'data/survey_results_NA.json', continent: 'north america' }
    // Ajoutez d'autres fichiers si nécessaire
];

// Taux de conversion vers l'euro
const exchangeRates = {
    'USD': 0.85, // 1 USD = 0.85 EUR
    'EUR': 1,    // 1 EUR = 1 EUR
    'GBP': 1.15, // 1 GBP = 1.15 EUR
    'CAD': 0.65, // 1 CAD = 0.65 EUR
};

let rawData = [];

// Fonction pour charger les données
async function fetchAllData(urls) {
    const allData = [];

    for (const item of urls) {
        try {
            const response = await fetch(item.url);
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des données : ' + response.status);
            }
            const data = await response.json();
            // Ajout du champ Continent à chaque enregistrement
            data.forEach(entry => {
                entry.Continent = item.continent.toLowerCase();
            });
            allData.push(...data);
        } catch (error) {
            console.error('Erreur lors du chargement du fichier ' + item.url + ' :', error);
        }
    }

    return allData;
}

// Fonction pour normaliser les années d'expérience
function normalizeWorkExp(value) {
    if (!value) return 0;
    if (value === 'Less than 1 year') return 0.5;
    if (value === 'More than 50 years') return 50;
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? 0 : parsedValue;
}

// Fonction pour vérifier si l'expérience est dans la plage sélectionnée
function isExperienceInRange(yearsExperience, selectedExperience) {
    switch (selectedExperience) {
        case '0-5':
            return yearsExperience >= 0 && yearsExperience <= 5;
        case '6-10':
            return yearsExperience >= 6 && yearsExperience <= 10;
        case '11-15':
            return yearsExperience >= 11 && yearsExperience <= 15;
        case '16-20':
            return yearsExperience >= 16 && yearsExperience <= 20;
        case '21+':
            return yearsExperience >= 21;
        case 'all':
        default:
            return true;
    }
}

// Fonction pour remplir les pays pour une section spécifique
function populateCountries(data, continent, countrySelectId) {
    const countrySet = new Set();

    data.forEach(item => {
        if (continent === 'all' || item.Continent === continent) {
            countrySet.add(item.Country);
        }
    });

    const countrySelect = document.getElementById(countrySelectId);
    countrySelect.innerHTML = '';

    // Ajouter une option pour tous les pays
    const allOption = document.createElement('option');
    allOption.value = 'All';
    allOption.textContent = 'Tous les pays';
    countrySelect.appendChild(allOption);

    countrySet.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
}

// Fonction pour remplir les métiers (DevType) pour une section spécifique
function populateDevTypes(data, devTypeSelectId) {
    const devTypeSet = new Set();

    data.forEach(item => {
        if (item.DevType && item.DevType !== 'NA') {
            const devTypes = item.DevType.split(';');
            devTypes.forEach(devType => devTypeSet.add(devType.trim()));
        }
    });

    const devTypeSelect = document.getElementById(devTypeSelectId);
    devTypeSelect.innerHTML = '';

    // Ajouter une option pour tous les DevTypes
    const allOption = document.createElement('option');
    allOption.value = 'All';
    allOption.textContent = 'Tous les métiers';
    devTypeSelect.appendChild(allOption);

    devTypeSet.forEach(devType => {
        const option = document.createElement('option');
        option.value = devType;
        option.textContent = devType;
        devTypeSelect.appendChild(option);
    });
}

// Initialisation
async function init() {
    rawData = await fetchAllData(dataURLs);

    // Peupler les sélecteurs pour chaque section
    populateCountries(rawData, 'all', 'country-experience');
    populateCountries(rawData, 'all', 'country-competences');
    populateDevTypes(rawData, 'devType-technologies');

    // Rendre les graphiques initiaux
    renderExperienceCharts();
    renderCompetenceCharts();
    renderTechnologyCharts();
}

// Exécution
document.addEventListener('DOMContentLoaded', init);