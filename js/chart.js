// js/charts.js

let experienceChart = null;
let educationChart = null;
let cloudPlatformChart = null;
let webFrameworkChart = null;
let osChart = null;
let communicationToolsChart = null;

/* ------------------------------------------------------------------------
   Focus sur le revenu moyen en fonction de l’expérience professionnelle
------------------------------------------------------------------------ */

// Calculer le revenu moyen par expérience
function calculateAverageSalaryByExperience(data, selectedContinent, selectedCountry) {
    const experienceMap = {};

    data.forEach(item => {
        // Vérification des champs nécessaires
        const necessaryFields = ['WorkExp', 'CompTotal', 'Currency'];
        for (const field of necessaryFields) {
            if (!item[field] || item[field] === 'NA') {
                return;
            }
        }

        // Filtrage par continent
        if (selectedContinent !== 'all' && item.Continent !== selectedContinent) return;

        // Filtrage par pays
        if (selectedCountry !== 'All' && item.Country !== selectedCountry) return;

        // Normalisation des années d'expérience
        const yearsExperience = normalizeWorkExp(item.WorkExp);
        if (yearsExperience < 0 || yearsExperience > 50) return;

        // Traitement du salaire
        const salaryStr = item.CompTotal.toString().replace(/,/g, '');
        const salary = parseFloat(salaryStr);
        if (isNaN(salary) || salary <= 0) return;

        // Conversion du salaire en euros
        const currency = item.Currency.split('\t')[0];
        const exchangeRate = exchangeRates[currency] || 1;
        const salaryInEuro = salary * exchangeRate;

        // Filtrer les salaires aberrants
        if (salaryInEuro < 10000 || salaryInEuro > 300000) return;

        if (!experienceMap[yearsExperience]) {
            experienceMap[yearsExperience] = { total: 0, count: 0 };
        }

        experienceMap[yearsExperience].total += salaryInEuro;
        experienceMap[yearsExperience].count += 1;
    });

    const labels = [];
    const averages = [];
    Object.keys(experienceMap)
        .sort((a, b) => a - b)
        .forEach(years => {
            labels.push(years + " ans");
            const average = experienceMap[years].total / experienceMap[years].count;
            averages.push(average.toFixed(2));
        });

    return { labels, averages };
}

// Fonction pour afficher le graphique de l'expérience
function renderExperienceChart() {
    const selectedContinent = document.getElementById('continent-experience').value;
    const selectedCountry = document.getElementById('country-experience').value;
    const { labels, averages } = calculateAverageSalaryByExperience(rawData, selectedContinent, selectedCountry);

    const ctx = document.getElementById('experienceChart').getContext('2d');

    // Destruction du graphique précédent s'il existe
    if (experienceChart && typeof experienceChart.destroy === 'function') {
        experienceChart.destroy();
    }

    experienceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenu moyen (en €)',
                data: averages,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Revenu moyen (€)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Années d\'expérience'
                    }
                }
            }
        }
    });
}

// Calculer le revenu moyen par niveau d'études
function calculateAverageSalaryByEducation(data, selectedContinent, selectedCountry) {
    const educationMap = {};

    data.forEach(item => {
        // Vérification des champs nécessaires
        const necessaryFields = ['EdLevel', 'CompTotal', 'Currency'];
        for (const field of necessaryFields) {
            if (!item[field] || item[field] === 'NA') {
                return;
            }
        }

        // Filtrage par continent
        if (selectedContinent !== 'all' && item.Continent !== selectedContinent) return;

        // Filtrage par pays
        if (selectedCountry !== 'All' && item.Country !== selectedCountry) return;

        const educationLevel = item.EdLevel;
        if (!educationLevel) return;

        // Traitement du salaire
        const salaryStr = item.CompTotal.toString().replace(/,/g, '');
        const salary = parseFloat(salaryStr);
        if (isNaN(salary) || salary <= 0) return;

        // Conversion du salaire en euros
        const currency = item.Currency.split('\t')[0];
        const exchangeRate = exchangeRates[currency] || 1;
        const salaryInEuro = salary * exchangeRate;

        // Filtrer les salaires aberrants
        if (salaryInEuro < 10000 || salaryInEuro > 300000) return;

        if (!educationMap[educationLevel]) {
            educationMap[educationLevel] = { total: 0, count: 0 };
        }

        educationMap[educationLevel].total += salaryInEuro;
        educationMap[educationLevel].count += 1;
    });

    const labels = [];
    const averages = [];
    Object.keys(educationMap)
        .forEach(level => {
            labels.push(level);
            const average = educationMap[level].total / educationMap[level].count;
            averages.push(average.toFixed(2));
        });

    return { labels, averages };
}

// Fonction pour afficher le graphique du niveau d'études
function renderEducationChart() {
    const selectedContinent = document.getElementById('continent-experience').value;
    const selectedCountry = document.getElementById('country-experience').value;
    const { labels, averages } = calculateAverageSalaryByEducation(rawData, selectedContinent, selectedCountry);

    const ctx = document.getElementById('educationChart').getContext('2d');

    // Destruction du graphique précédent s'il existe
    if (educationChart && typeof educationChart.destroy === 'function') {
        educationChart.destroy();
    }

    educationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenu moyen (en €)',
                data: averages,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Revenu moyen (€)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Niveau d\'études'
                    }
                }
            }
        }
    });
}

// Fonction pour rendre les graphiques de la section expérience
function renderExperienceCharts() {
    renderExperienceChart();
    renderEducationChart();
}

/* ------------------------------------------------------------------------
   Focus sur le revenu moyen en fonction des compétences techniques
------------------------------------------------------------------------ */

// Calculer le revenu moyen par plateformes de cloud
function calculateAverageSalaryByCloudPlatform(data, selectedContinent, selectedCountry, selectedExperience) {
    const platformMap = {};

    data.forEach(item => {
        // Vérification des champs nécessaires
        const necessaryFields = ['PlatformHaveWorkedWith', 'CompTotal', 'Currency', 'WorkExp'];
        for (const field of necessaryFields) {
            if (!item[field] || item[field] === 'NA') {
                return;
            }
        }

        // Filtrage par continent
        if (selectedContinent !== 'all' && item.Continent !== selectedContinent) return;

        // Filtrage par pays
        if (selectedCountry !== 'All' && item.Country !== selectedCountry) return;

        // Filtrage par années d'expérience
        const yearsExperience = normalizeWorkExp(item.WorkExp);
        if (!isExperienceInRange(yearsExperience, selectedExperience)) return;

        // Traitement du salaire
        const salaryStr = item.CompTotal.toString().replace(/,/g, '');
        const salary = parseFloat(salaryStr);
        if (isNaN(salary) || salary <= 0) return;

        // Conversion du salaire en euros
        const currency = item.Currency.split('\t')[0];
        const exchangeRate = exchangeRates[currency] || 1;
        const salaryInEuro = salary * exchangeRate;

        // Filtrer les salaires aberrants
        if (salaryInEuro < 10000 || salaryInEuro > 300000) return;

        // Plateformes de cloud
        const platforms = item.PlatformHaveWorkedWith.split(';');

        platforms.forEach(platform => {
            platform = platform.trim();
            if (!platformMap[platform]) {
                platformMap[platform] = { total: 0, count: 0 };
            }
            platformMap[platform].total += salaryInEuro;
            platformMap[platform].count += 1;
        });
    });

    const labels = [];
    const averages = [];
    Object.keys(platformMap)
        .forEach(platform => {
            labels.push(platform);
            const average = platformMap[platform].total / platformMap[platform].count;
            averages.push(average.toFixed(2));
        });

    return { labels, averages };
}

// Fonction pour afficher le graphique des plateformes de cloud
function renderCloudPlatformChart() {
    const selectedContinent = document.getElementById('continent-competences').value;
    const selectedCountry = document.getElementById('country-competences').value;
    const selectedExperience = document.getElementById('experience-competences').value;

    const { labels, averages } = calculateAverageSalaryByCloudPlatform(rawData, selectedContinent, selectedCountry, selectedExperience);

    const ctx = document.getElementById('cloudPlatformChart').getContext('2d');

    // Destruction du graphique précédent s'il existe
    if (cloudPlatformChart && typeof cloudPlatformChart.destroy === 'function') {
        cloudPlatformChart.destroy();
    }

    cloudPlatformChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenu moyen (en €)',
                data: averages,
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Revenu moyen (€)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Plateformes de cloud'
                    }
                }
            }
        }
    });
}

// Calculer le revenu moyen par frameworks web
function calculateAverageSalaryByWebFramework(data, selectedContinent, selectedCountry, selectedExperience) {
    const frameworkMap = {};

    data.forEach(item => {
        // Vérification des champs nécessaires
        const necessaryFields = ['WebframeHaveWorkedWith', 'CompTotal', 'Currency', 'WorkExp'];
        for (const field of necessaryFields) {
            if (!item[field] || item[field] === 'NA') {
                return;
            }
        }

        // Filtrage par continent
        if (selectedContinent !== 'all' && item.Continent !== selectedContinent) return;

        // Filtrage par pays
        if (selectedCountry !== 'All' && item.Country !== selectedCountry) return;

        // Filtrage par années d'expérience
        const yearsExperience = normalizeWorkExp(item.WorkExp);
        if (!isExperienceInRange(yearsExperience, selectedExperience)) return;

        // Traitement du salaire
        const salaryStr = item.CompTotal.toString().replace(/,/g, '');
        const salary = parseFloat(salaryStr);
        if (isNaN(salary) || salary <= 0) return;

        // Conversion du salaire en euros
        const currency = item.Currency.split('\t')[0];
        const exchangeRate = exchangeRates[currency] || 1;
        const salaryInEuro = salary * exchangeRate;

        // Filtrer les salaires aberrants
        if (salaryInEuro < 10000 || salaryInEuro > 300000) return;

        // Frameworks web
        const frameworks = item.WebframeHaveWorkedWith.split(';');

        frameworks.forEach(framework => {
            framework = framework.trim();
            if (!frameworkMap[framework]) {
                frameworkMap[framework] = { total: 0, count: 0 };
            }
            frameworkMap[framework].total += salaryInEuro;
            frameworkMap[framework].count += 1;
        });
    });

    const labels = [];
    const averages = [];
    Object.keys(frameworkMap)
        .forEach(framework => {
            labels.push(framework);
            const average = frameworkMap[framework].total / frameworkMap[framework].count;
            averages.push(average.toFixed(2));
        });

    return { labels, averages };
}

// Fonction pour afficher le graphique des frameworks web
function renderWebFrameworkChart() {
    const selectedContinent = document.getElementById('continent-competences').value;
    const selectedCountry = document.getElementById('country-competences').value;
    const selectedExperience = document.getElementById('experience-competences').value;

    const { labels, averages } = calculateAverageSalaryByWebFramework(rawData, selectedContinent, selectedCountry, selectedExperience);

    const ctx = document.getElementById('webFrameworkChart').getContext('2d');

    // Destruction du graphique précédent s'il existe
    if (webFrameworkChart && typeof webFrameworkChart.destroy === 'function') {
        webFrameworkChart.destroy();
    }

    webFrameworkChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenu moyen (en €)',
                data: averages,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Revenu moyen (€)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Frameworks web'
                    }
                }
            }
        }
    });
}

// Fonction pour rendre les graphiques de la section compétences
function renderCompetenceCharts() {
    renderCloudPlatformChart();
    renderWebFrameworkChart();
}

/* ------------------------------------------------------------------------
   Focus sur les technologies les plus utilisées
------------------------------------------------------------------------ */

// Calculer le top N des systèmes d'exploitation
function calculateTopOperatingSystems(data, selectedContinent, selectedDevType, topN) {
    const osCount = {};

    data.forEach(item => {
        // Vérification des champs nécessaires
        const necessaryFields = ['OpSysProfessionaluse', 'DevType'];
        for (const field of necessaryFields) {
            if (!item[field] || item[field] === 'NA') {
                return;
            }
        }

        // Filtrage par continent
        if (selectedContinent !== 'all' && item.Continent !== selectedContinent) return;

        // Filtrage par DevType
        if (selectedDevType !== 'All' && !item.DevType.includes(selectedDevType)) return;

        // Systèmes d'exploitation
        const osList = item.OpSysProfessionaluse.split(';');

        osList.forEach(os => {
            os = os.trim();
            if (!osCount[os]) {
                osCount[os] = 0;
            }
            osCount[os] += 1;
        });
    });

    // Trier les systèmes d'exploitation par utilisation décroissante
    const sortedOs = Object.entries(osCount).sort((a, b) => b[1] - a[1]);

    const labels = [];
    const counts = [];

    sortedOs.slice(0, topN).forEach(([os, count]) => {
        labels.push(os);
        counts.push(count);
    });

    return { labels, counts };
}

// Fonction pour afficher le graphique des systèmes d'exploitation
function renderOsChart() {
    const selectedContinent = document.getElementById('continent-technologies').value;
    const selectedDevType = document.getElementById('devType-technologies').value;
    const topN = parseInt(document.getElementById('topN-technologies').value);

    const { labels, counts } = calculateTopOperatingSystems(rawData, selectedContinent, selectedDevType, topN);

    const ctx = document.getElementById('osChart').getContext('2d');

    // Destruction du graphique précédent s'il existe
    if (osChart && typeof osChart.destroy === 'function') {
        osChart.destroy();
    }

    osChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Nombre d\'utilisations',
                data: counts,
                backgroundColor: 'rgba(255, 205, 86, 0.2)',
                borderColor: 'rgba(255, 205, 86, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Nombre d\'utilisations'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Systèmes d\'exploitation'
                    }
                }
            }
        }
    });
}

// Calculer le top N des outils de communication
function calculateTopCommunicationTools(data, selectedContinent, selectedDevType, topN) {
    const toolsCount = {};

    data.forEach(item => {
        // Vérification des champs nécessaires
        const necessaryFields = ['OfficeStackSyncHaveWorkedWith', 'DevType'];
        for (const field of necessaryFields) {
            if (!item[field] || item[field] === 'NA') {
                return;
            }
        }

        // Filtrage par continent
        if (selectedContinent !== 'all' && item.Continent !== selectedContinent) return;

        // Filtrage par DevType
        if (selectedDevType !== 'All' && !item.DevType.includes(selectedDevType)) return;

        // Outils de communication
        const toolsList = item.OfficeStackSyncHaveWorkedWith.split(';');

        toolsList.forEach(tool => {
            tool = tool.trim();
            if (!toolsCount[tool]) {
                toolsCount[tool] = 0;
            }
            toolsCount[tool] += 1;
        });
    });

    // Trier les outils par utilisation décroissante
    const sortedTools = Object.entries(toolsCount).sort((a, b) => b[1] - a[1]);

    const labels = [];
    const counts = [];

    sortedTools.slice(0, topN).forEach(([tool, count]) => {
        labels.push(tool);
        counts.push(count);
    });

    return { labels, counts };
}

// Fonction pour afficher le graphique des outils de communication
function renderCommunicationToolsChart() {
    const selectedContinent = document.getElementById('continent-technologies').value;
    const selectedDevType = document.getElementById('devType-technologies').value;
    const topN = parseInt(document.getElementById('topN-technologies').value);

    const { labels, counts } = calculateTopCommunicationTools(rawData, selectedContinent, selectedDevType, topN);

    const ctx = document.getElementById('communicationToolsChart').getContext('2d');

    // Destruction du graphique précédent s'il existe
    if (communicationToolsChart && typeof communicationToolsChart.destroy === 'function') {
        communicationToolsChart.destroy();
    }

    communicationToolsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Nombre d\'utilisations',
                data: counts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Nombre d\'utilisations'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Outils de communication'
                    }
                }
            }
        }
    });
}

// Fonction pour rendre les graphiques de la section technologies
function renderTechnologyCharts() {
    renderOsChart();
    renderCommunicationToolsChart();
}

/* ------------------------------------------------------------------------
   Écouteurs d'événements pour chaque section
------------------------------------------------------------------------ */

// Section expérience
document.getElementById('continent-experience').addEventListener('change', () => {
    const selectedContinent = document.getElementById('continent-experience').value;
    populateCountries(rawData, selectedContinent, 'country-experience');
    renderExperienceCharts();
});

document.getElementById('country-experience').addEventListener('change', renderExperienceCharts);

// Section compétences
document.getElementById('continent-competences').addEventListener('change', () => {
    const selectedContinent = document.getElementById('continent-competences').value;
    populateCountries(rawData, selectedContinent, 'country-competences');
    renderCompetenceCharts();
});

document.getElementById('country-competences').addEventListener('change', renderCompetenceCharts);
document.getElementById('experience-competences').addEventListener('change', renderCompetenceCharts);

// Section technologies
document.getElementById('continent-technologies').addEventListener('change', renderTechnologyCharts);
document.getElementById('devType-technologies').addEventListener('change', renderTechnologyCharts);
document.getElementById('topN-technologies').addEventListener('change', renderTechnologyCharts);