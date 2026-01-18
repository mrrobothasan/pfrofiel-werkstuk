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

    const userData = {};
    const userAnswers = {};
    let sessionData = {};
    let recall1Timer, recall2Timer;
    let isSoundOn = true;

    const backgroundAudio = document.getElementById('background-audio');
    const soundToggleButton = $('#sound-toggle');
    const soundIcon = $('#sound-icon');

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

    function toggleSound() {
        isSoundOn = !isSoundOn;
        if (isSoundOn) {
            backgroundAudio.play();
            soundIcon.text('🔊');
        } else {
            backgroundAudio.pause();
            soundIcon.text('🔇');
        }
    }

    soundToggleButton.on('click', toggleSound);

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

    function startTimer(duration, displayElement, callback) {
        let timer = duration;
        displayElement.removeClass('ending').text(timer);
        const interval = setInterval(() => {
            timer--;
            displayElement.text(timer);
            if (timer <= 5) {
                displayElement.addClass('ending');
            }
            if (timer <= 0) {
                clearInterval(interval);
                setTimeout(callback, 1000);
            }
        }, 1000);
        return interval;
    }

    $('#start-button').on('click', () => {
        if (isSoundOn) {
            backgroundAudio.play();
        }
        setupSession();
        showPage('userInfo', 'intro');
    });

    $('#user-info-form').on('submit', (e) => {
        e.preventDefault();
        userData.name = $('#naam').val();
        userData.gender = $('#geslacht').val();
        userData.age = $('#leeftijd').val();
        showPage('image1', 'fase1');
        startTimer(15, $('#timer-1'), () => {
            showPage('thinking1', 'fase1');
            startTimer(10, $('#timer-2'), () => {
                showPage('recall1', 'fase1');
                recall1Timer = startTimer(30, $('#recall-timer-1'), () => $('#next-recall-1').trigger('click'));
            });
        });
    });

    $('#next-recall-1').on('click', () => {
        clearInterval(recall1Timer);
        userAnswers.recall1 = $('#recall-input-1').val();
        showPage('image2', 'fase2');
        startTimer(15, $('#timer-3'), () => {
            showPage('thinking2', 'fase2');
            startTimer(10, $('#timer-4'), () => {
                showPage('recall2', 'fase2');
                recall2Timer = startTimer(30, $('#recall-timer-2'), () => $('#submit-recall-2').trigger('click'));
            });
        });
    });

    $('#submit-recall-2').on('click', () => {
        clearInterval(recall2Timer);
        userAnswers.recall2 = $('#recall-input-2').val();
        showResults();
        showPage('results', 'resultaat');
        backgroundAudio.pause();
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

    function showResults() {
        const { score1, correctWordsFound1, score2, correctWordsFound2 } = calculateScores();
        
        const allPossibleAnswers1 = sessionData.image1.answers.map(group => group.join(' / ')).join(', ');
        const allPossibleAnswers2 = sessionData.image2.answers.map(group => group.join(' / ')).join(', ');

        $('#results-content').html(`
            <h3>Resultaten voor ${sessionData.order[0] === 'animal' ? 'Dieren Afbeelding' : 'Woorden Afbeelding'}:</h3>
            <p><strong>Jouw antwoorden:</strong> ${userAnswers.recall1 || 'Geen antwoorden gegeven'}</p>
            <p><strong>Jouw correcte antwoorden:</strong> ${correctWordsFound1.join(', ') || 'Geen'}</p>
            <p><strong>Alle mogelijke antwoorden:</strong> ${allPossibleAnswers1}</p>
            <p><strong>Score:</strong> ${score1} / ${sessionData.image1.answers.length}</p>
            <hr>
            <h3>Resultaten voor ${sessionData.order[1] === 'animal' ? 'Dieren Afbeelding' : 'Woorden Afbeelding'}:</h3>
            <p><strong>Jouw antwoorden:</strong> ${userAnswers.recall2 || 'Geen antwoorden gegeven'}</p>
            <p><strong>Jouw correcte antwoorden:</strong> ${correctWordsFound2.join(', ') || 'Geen'}</p>
            <p><strong>Alle mogelijke antwoorden:</strong> ${allPossibleAnswers2}</p>
            <p><strong>Score:</strong> ${score2} / ${sessionData.image2.answers.length}</p>
        `);
    }

    updateProgress('intro');
});