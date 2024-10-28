document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quiz-form');
    const result = document.getElementById('result');
    const footerText = document.querySelector('.footer-text');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        let correctCount = 0;
        const questions = form.querySelectorAll('.quiz-question');

        questions.forEach(question => {
            const questionName = question.dataset.questionName;
            const correctAnswer = question.dataset.correctAnswer;
            const userAnswer = formData.get(questionName);
            const isCorrect = userAnswer === correctAnswer;

            if (isCorrect) {
                correctCount++;
                question.style.backgroundColor = 'lightgreen';
                question.classList.remove('wrong-answer');
            } else {
                question.style.backgroundColor = 'rgb(255, 184, 184)';
                question.classList.add('wrong-answer');
            }
        });

        const errorsCount = questions.length - correctCount;
        if (errorsCount > 0) {
            footerText.innerHTML = `<b>😿 Il reste quelques erreurs.👀</b><br><br>Retente une autre réponse dans la case rouge, puis re-valide!<b><br><br>${correctCount}/${questions.length}</b>`;
        } else {
            footerText.innerHTML = `<b>✨ Bravo, vous avez réussi ! 😊</b><b><br><br>${correctCount}/${questions.length}</b>`;
        }

        result.textContent = `Vous avez ${correctCount} bonnes réponses sur ${questions.length}.`;
        result.style.display = 'block';
        footerText.style.display = 'block';
        window.scrollTo(0, document.body.scrollHeight);
    });
});