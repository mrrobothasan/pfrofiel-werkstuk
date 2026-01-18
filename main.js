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
                    'eend',
                    'regenboog',
                    'blad',
                    'klavervier',
                    'druif',
                    'druiven',
                    'brandblusser',
                    'aarde',
                    'aardbol',
                    'aardebol',
                    'basketbal',
                    'zonnebloem',
                    'bloem',
                    'varken',
                    'varkentje',
                ],
            },
            words: {
                path: 'imgs/words-black.jpeg',
                answers: [
                    'kikker',
                    'roos',
                    'aubergine',
                    'boom',
                    'flamingo',
                    'pompoen',
                    'banaan',
                    'water',
                    'gras',
                ],
            },
        },
        right: {
            animal: {
                path: 'imgs/animal-right.jpeg',
                answers: [
                    'eend',
                    'regenboog',
                    'blad',
                    'klavervier',
                    'druif',
                    'druiven',
                    'brandblusser',
                    'aarde',
                    'aardbol',
                    'aardebol',
                    'basketbal',
                    'zonnebloem',
                    'bloem',
                    'varken',
                    'varkentje',
                ],
            },
            words: {
                path: 'imgs/words-right.jpeg',
                answers: [
                    'kikker',
                    'roos',
                    'aubergine',
                    'boom',
                    'flamingo',
                    'pompoen',
                    'banaan',
                    'water',
                    'gras',
                ],
            },
        },
        wrong: {
            animal: {
                path: 'imgs/animal-wrong.jpeg',
                answers: [
                    'eend',
                    'regenboog',
                    'blad',
                    'klavervier',
                    'druif',
                    'druiven',
                    'brandblusser',
                    'aarde',
                    'aardbol',
                    'aardebol',
                    'basketbal',
                    'zonnebloem',
                    'bloem',
                    'varken',
                    'varkentje',
                ],
            },
            words: {
                path: 'imgs/words-wrong.jpeg',
                answers: [
                    'kikker',
                    'roos',
                    'aubergine',
                    'boom',
                    'flamingo',
                    'pompoen',
                    'banaan',
                    'water',
                    'gras',
                ],
            },
        },
    };

    function playSound(soundFile) {
        if (isSoundOn) {
            const audio = new Audio(`sounds/${soundFile}`);
            audio
                .play()
                .catch((e) =>
                    console.error(`Could not play sound: ${soundFile}`, e)
                );
        }
    }

    function toggleSound() {
        isSoundOn = !isSoundOn;
        if (isSoundOn) {
            backgroundAudio.play();
            soundIcon.html('&#x1F50A;'); // Speaker High Volume
        } else {
            backgroundAudio.pause();
            soundIcon.html('&#x1F507;'); // Speaker Off
        }
    }

    soundToggleButton.on('click', toggleSound);

    function setupSession() {
        const themes = Object.keys(imageSets);
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];
        const order =
            Math.random() < 0.5 ? ['animal', 'words'] : ['words', 'animal'];

        sessionData.theme = randomTheme;
        sessionData.order = order;

        sessionData.image1 = imageSets[randomTheme][order[0]];
        sessionData.image2 = imageSets[randomTheme][order[1]];

        $('#image-page-1 img').attr('src', sessionData.image1.path);
        $('#image-page-2 img').attr('src', sessionData.image2.path);
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
        displayElement.removeClass('ending');
        displayElement.text(timer);
        const interval = setInterval(() => {
            timer--;
            displayElement.text(timer);

            if (timer === 5) {
                displayElement.addClass('ending');
            } else if (timer < 5) {
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
                recall1Timer = startTimer(30, $('#recall-timer-1'), () => {
                    $('#next-recall-1').trigger('click');
                });
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
                recall2Timer = startTimer(30, $('#recall-timer-2'), () => {
                    $('#submit-recall-2').trigger('click');
                });
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

    function showResults() {
        const answers1 = userAnswers.recall1.toLowerCase().split(/[\s,]+/);
        const answers2 = userAnswers.recall2.toLowerCase().split(/[\s,]+/);

        const score1 = answers1.filter((word) =>
            sessionData.image1.answers.includes(word)
        ).length;
        const score2 = answers2.filter((word) =>
            sessionData.image2.answers.includes(word)
        ).length;

        const resultsContent = $('#results-content');
        resultsContent.html(`
            <h3>Resultaten voor Afbeelding 1:</h3>
            <p><strong>Je antwoorden:</strong> ${userAnswers.recall1}</p>
            <p><strong>Correcte antwoorden:</strong> ${sessionData.image1.answers.join(', ')}</p>
            <p><strong>Score:</strong> ${score1} / ${sessionData.image1.answers.length}</p>

            <h3>Resultaten voor Afbeelding 2:</h3>
            <p><strong>Je antwoorden:</strong> ${userAnswers.recall2}</p>
            <p><strong>Correcte antwoorden:</strong> ${sessionData.image2.answers.join(', ')}</p>
            <p><strong>Score:</strong> ${score2} / ${sessionData.image2.answers.length}</p>
        `);
    }

    updateProgress('intro');
});
