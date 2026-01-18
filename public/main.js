$(document).ready(function () {
    const pages = {
        introduction: $('#introduction-page'),
        userInfo: $('#user-info-page'),
        image1: $('#image-page-1'),
        thinking1: $('#thinking-page-1'),
        recall1: $('#recall-page-1'),
        image2: $('#image-page-2'),
        thinking2: $('#thinking-page-2'),
        recall2: $('#recall-page-2'),
        results: $('#results-page'),
    };

    const mainTimer = $('#main-timer');
    let mainTimerInterval;

    const userData = {};
    const userAnswers = {};
    let sessionData = {};
    let isSoundOn = true;

    const imageSets = {
        black: {
            animal: {
                path: 'imgs/animal-black.jpeg',
                answers: [
                    ['eend'], ['regenboog'], ['blad', 'klavervier'],
                    ['druif', 'druiven'], ['brandblusser'], 
                    ['aarde', 'aardbol', 'aardebol'], ['basketbal'],
                    ['zonnebloem', 'bloem'], ['varken', 'varkentje'],
                ],
            },
            words: {
                path: 'imgs/words-black.jpeg',
                answers: [
                    ['kikker'], ['roos'], ['aubergine'], ['boom'], ['flamingo'],
                    ['pompoen'], ['banaan'], ['water'], ['gras']
                ],
            },
        },
        right: {
            animal: {
                path: 'imgs/animal-right.jpeg',
                answers: [
                    ['eend'], ['regenboog'], ['blad', 'klavervier'],
                    ['druif', 'druiven'], ['brandblusser'], 
                    ['aarde', 'aardbol', 'aardebol'], ['basketbal'],
                    ['zonnebloem', 'bloem'], ['varken', 'varkentje'],
                ],
            },
            words: {
                path: 'imgs/words-right.jpeg',
                answers: [
                    ['kikker'], ['roos'], ['aubergine'], ['boom'], ['flamingo'],
                    ['pompoen'], ['banaan'], ['water'], ['gras']
                ],
            },
        },
        wrong: {
            animal: {
                path: 'imgs/animal-wrong.jpeg',
                answers: [
                    ['eend'], ['regenboog'], ['blad', 'klavervier'],
                    ['druif', 'druiven'], ['brandblusser'], 
                    ['aarde', 'aardbol', 'aardebol'], ['basketbal'],
                    ['zonnebloem', 'bloem'], ['varken', 'varkentje'],
                ],
            },
            words: {
                path: 'imgs/words-wrong.jpeg',
                answers: [
                    ['kikker'], ['roos'], ['aubergine'], ['boom'], ['flamingo'],
                    ['pompoen'], ['banaan'], ['water'], ['gras']
                ],
            },
        },
    };

    function playSound(soundFile) {
        if (isSoundOn) {
            const audio = new Audio(`sounds/${soundFile}`);
            audio.play().catch(e => console.error(`Could not play sound: ${soundFile}`, e));
        }
    }

    function startMainTimer(duration, callback) {
        clearInterval(mainTimerInterval);
        let timer = duration;
        mainTimer.removeClass('ending').text(timer.toString().padStart(2, '0'));
        mainTimerInterval = setInterval(() => {
            timer--;
            mainTimer.text(timer.toString().padStart(2, '0'));
            if (timer <= 5 && timer > 0) {
                mainTimer.addClass('ending');
                if (isSoundOn) {
                    playSound('ending.wav');
                }
            }
            if (timer <= 0) {
                clearInterval(mainTimerInterval);
                mainTimer.removeClass('ending');
                if (callback) {
                    setTimeout(callback, 1000);
                }
            }
        }, 1000);
    }

    function setupSession() {
        const themes = Object.keys(imageSets);
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];
        const order = Math.random() < 0.5 ? ['animal', 'words'] : ['words', 'animal'];

        sessionData.theme = randomTheme;
        sessionData.order = order;
        sessionData.image1 = imageSets[randomTheme][order[0]];
        sessionData.image2 = imageSets[randomTheme][order[1]];

        $('#image-page-1 img').attr('src', sessionData.image1.path);
        $('#image-page-2 img').attr('src', sessionData.image2.path);

        const title1 = order[0] === 'animal' ? 'Onthoud deze objecten' : 'Onthoud deze woorden';
        $('#image-page-1-title').text(title1);

        const title2 = order[1] === 'animal' ? 'Onthoud deze objecten' : 'Onthoud deze woorden';
        $('#image-page-2-title').text(title2);
    }

    function updateProgress(step) {
        $('.progress-step').removeClass('active');
        $(`.progress-step[data-step="${step}"]`).addClass('active');
    }

    function showPage(pageId, progressStep) {
        $('.page.active').removeClass('active');
        pages[pageId].addClass('active');
        if (progressStep) {
            updateProgress(progressStep);
        }
    }

    $('#start-button').on('click', () => {
        setupSession();
        showPage('userInfo', 'intro');
    });

    $('#user-info-form').on('submit', (e) => {
        e.preventDefault();
        userData.name = $('#naam').val();
        userData.gender = $('#geslacht').val();
        userData.age = $('#leeftijd').val();
        showPage('image1', 'fase1');
        startMainTimer(15, () => {
            showPage('thinking1', 'fase1');
            startMainTimer(10, () => {
                showPage('recall1', 'fase1');
                startMainTimer(30, () => $('#next-recall-1').trigger('click'));
            });
        });
    });

    $('#next-recall-1').on('click', () => {
        userAnswers.recall1 = $('#recall-input-1').val();
        showPage('image2', 'fase2');
        startMainTimer(15, () => {
            showPage('thinking2', 'fase2');
            startMainTimer(10, () => {
                showPage('recall2', 'fase2');
                startMainTimer(30, () => $('#submit-recall-2').trigger('click'));
            });
        });
    });

    $('#submit-recall-2').on('click', () => {
        userAnswers.recall2 = $('#recall-input-2').val();
        clearInterval(mainTimerInterval);
        mainTimer.text('00');
        showResults();
        showPage('results', 'resultaat');
    });

    function calculateScores() {
        const uniqueUserWords1 = [...new Set(userAnswers.recall1.toLowerCase().split(/[\s,]+/))].filter(w => w);
        const uniqueUserWords2 = [...new Set(userAnswers.recall2.toLowerCase().split(/[\s,]+/))].filter(w => w);

        let score1 = 0;
        const correctWordsFound1 = [];
        sessionData.image1.answers.forEach(answerGroup => {
            const foundWord = answerGroup.find(synonym => uniqueUserWords1.includes(synonym));
            if (foundWord) {
                score1++;
                correctWordsFound1.push(foundWord);
            }
        });

        let score2 = 0;
        const correctWordsFound2 = [];
        sessionData.image2.answers.forEach(answerGroup => {
            const foundWord = answerGroup.find(synonym => uniqueUserWords2.includes(synonym));
            if (foundWord) {
                score2++;
                correctWordsFound2.push(foundWord);
            }
        });

        return { score1, correctWordsFound1, score2, correctWordsFound2 };
    }

    function saveResultsToFirestore(results) {
        db.collection("results").add(results)
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    }

    function showResults() {
        const { score1, correctWordsFound1, score2, correctWordsFound2 } = calculateScores();
        
        const resultsToSave = {
            naam: userData.name,
            leeftijd: parseInt(userData.age, 10) || 0,
            geslacht: userData.gender,
            antwoord1: userAnswers.recall1,
            antwoord2: userAnswers.recall2,
            score1: score1,
            score2: score2,
            thema: sessionData.theme,
            volgorde: sessionData.order.join(', '),
            timestamp: new Date()
        };

        saveResultsToFirestore(resultsToSave);

        const allPossibleAnswers1 = sessionData.image1.answers.map(group => group.join(' / '));
        const allPossibleAnswers2 = sessionData.image2.answers.map(group => group.join(' / '));
        
        const midPoint1 = Math.ceil(allPossibleAnswers1.length / 2);
        const line1_1 = allPossibleAnswers1.slice(0, midPoint1).join(', ');
        const line2_1 = allPossibleAnswers1.slice(midPoint1).join(', ');
        
        const midPoint2 = Math.ceil(allPossibleAnswers2.length / 2);
        const line1_2 = allPossibleAnswers2.slice(0, midPoint2).join(', ');
        const line2_2 = allPossibleAnswers2.slice(midPoint2).join(', ');

        $('#results-content').html(`
            <h3>Resultaten voor ${sessionData.order[0] === 'animal' ? 'Dieren Afbeelding' : 'Woorden Afbeelding'}:</h3>
            <p><strong>Jouw antwoorden:</strong> ${userAnswers.recall1 || 'Geen antwoorden gegeven'}</p>
            <p><strong>Jouw correcte antwoorden:</strong> ${correctWordsFound1.join(', ') || 'Geen'}</p>
            <p><strong>Alle mogelijke antwoorden:</strong> ${line1_1}${line2_1 ? '<br>' + line2_1 : ''}</p>
            <p><strong>Score:</strong> <span style="color: ${score1 < 5 ? 'red' : 'green'}">${score1} / ${sessionData.image1.answers.length}</span></p>
            <hr>
            <h3>Resultaten voor ${sessionData.order[1] === 'animal' ? 'Dieren Afbeelding' : 'Woorden Afbeelding'}:</h3>
            <p><strong>Jouw antwoorden:</strong> ${userAnswers.recall2 || 'Geen antwoorden gegeven'}</p>
            <p><strong>Jouw correcte antwoorden:</strong> ${correctWordsFound2.join(', ') || 'Geen'}</p>
            <p><strong>Alle mogelijke antwoorden:</strong>. ${line1_2}${line2_2 ? '<br>' + line2_2 : ''}</p>
            <p><strong>Score:</strong> <span style="color: ${score2 < 5 ? 'red' : 'green'}">${score2} / ${sessionData.image2.answers.length}</span></p>
        `);
    }

    updateProgress('intro');
});