document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById('resumeFile');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const jobDescriptionInput = document.getElementById('jobDescription');
    const resultsSection = document.getElementById('resultsSection');
    const matchPercentageElement = document.getElementById('matchPercentage');
    const missingSkillsList = document.getElementById('missingSkillsList');
    const resourcesList = document.getElementById('resourcesList');
    const selectedFileName = document.getElementById('selectedFileName');

    // Interview related elements
    const startInterviewBtn = document.getElementById('startInterviewBtn');
    const interviewContainer = document.getElementById('interviewContainer');
    const questionContainer = document.getElementById('interviewQuestion');
    const userAnswerInput = document.getElementById('userAnswer');
    const submitAnswerBtn = document.getElementById('submitAnswerBtn');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    const feedbackContainer = document.getElementById('feedbackContainer');

    let resumeContent = ''; // Store resume content globally
    let currentQuestionIndex = 0;
    let interviewQuestions = [];

    // Store analysis results globally
    let analysisResults = null;

    // Event Listeners
    fileInput.addEventListener('change', handleFileUpload);
    analyzeBtn.addEventListener('click', handleAnalysis);

    // Add event listeners for interview buttons
    if (startInterviewBtn) {
        startInterviewBtn.addEventListener('click', startInterview);
    }
    if (submitAnswerBtn) {
        submitAnswerBtn.addEventListener('click', submitAnswer);
    }
    if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener('click', showNextQuestion);
    }

    // File Upload Handler
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        selectedFileName.textContent = `Selected file: ${file.name}`;

        const reader = new FileReader();
        reader.onload = function(e) {
            resumeContent = e.target.result;
            console.log('Resume loaded successfully');
        };
        reader.onerror = function() {
            alert('Error reading the file');
        };
        reader.readAsText(file);
    }

    // Analysis Handler
    function handleAnalysis() {
        console.log('Analysis started');
        
        if (!resumeContent) {
            alert('Please upload a resume first');
            return;
        }

        const jobDescription = jobDescriptionInput.value.trim();
        if (!jobDescription) {
            alert('Please enter a job description');
            return;
        }

        resultsSection.style.display = 'block';
        analysisResults = analyzeResume(resumeContent, jobDescription);
        console.log('Analysis results:', analysisResults);
        displayResults(analysisResults);
    }

    // Resume Analysis
    function analyzeResume(resume, jobDescription) {
        const skills = {
            programming: ['python', 'javascript', 'java', 'c++', 'c#', 'ruby', 'php'],
            frameworks: ['react', 'angular', 'vue', 'django', 'flask', 'spring'],
            databases: ['sql', 'mongodb', 'postgresql', 'mysql'],
            tools: ['git', 'docker', 'kubernetes', 'jenkins'],
            cloud: ['aws', 'azure', 'gcp'],
            other: ['agile', 'scrum', 'rest api', 'graphql']
        };

        const allSkills = Object.values(skills).flat();
        
        // Convert both texts to lowercase for case-insensitive comparison
        const resumeLower = resume.toLowerCase();
        const jobDescLower = jobDescription.toLowerCase();

        // Find skills in job description
        const jobSkills = allSkills.filter(skill => 
            jobDescLower.includes(skill.toLowerCase())
        );

        // Find skills in resume
        const resumeSkills = allSkills.filter(skill => 
            resumeLower.includes(skill.toLowerCase())
        );

        // Calculate matching and missing skills
        const matchingSkills = jobSkills.filter(skill => 
            resumeSkills.includes(skill)
        );
        const missingSkills = jobSkills.filter(skill => 
            !resumeSkills.includes(skill)
        );

        // Calculate match percentage
        const matchPercentage = jobSkills.length > 0 
            ? Math.round((matchingSkills.length / jobSkills.length) * 100) 
            : 0;

        console.log('Job Skills:', jobSkills);
        console.log('Resume Skills:', resumeSkills);
        console.log('Missing Skills:', missingSkills);
        console.log('Match Percentage:', matchPercentage);

        return {
            matchPercentage,
            matchingSkills,
            missingSkills
        };
    }

    // Display Results
    function displayResults(analysis) {
        console.log('Displaying results');
        
        // Update match percentage
        matchPercentageElement.textContent = analysis.matchPercentage;

        // Update missing skills list
        missingSkillsList.innerHTML = analysis.missingSkills
            .map(skill => `<li>${capitalizeFirstLetter(skill)}</li>`)
            .join('');

        // Update resources list
        resourcesList.innerHTML = analysis.missingSkills
            .map(skill => `
                <div class="skill-resources">
                    <h4>${capitalizeFirstLetter(skill)}</h4>
                    <ul>
                        <li><a href="https://www.udemy.com/courses/search/?q=${skill}" target="_blank">
                            Udemy Courses for ${capitalizeFirstLetter(skill)}
                        </a></li>
                        <li><a href="https://www.coursera.org/search?query=${skill}" target="_blank">
                            Coursera Courses for ${capitalizeFirstLetter(skill)}
                        </a></li>
                        <li><a href="https://www.youtube.com/results?search_query=${skill}+tutorial" target="_blank">
                            YouTube Tutorials for ${capitalizeFirstLetter(skill)}
                        </a></li>
                    </ul>
                </div>
            `)
            .join('');

        // Make results visible with animation
        resultsSection.style.opacity = '0';
        resultsSection.style.display = 'block';
        setTimeout(() => {
            resultsSection.style.opacity = '1';
        }, 10);
    }

    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function startInterview() {
        console.log('Starting interview...');
        
        if (!analysisResults || !analysisResults.missingSkills) {
            alert('Please analyze your resume first to identify skill gaps.');
            return;
        }

        if (interviewContainer) {
            interviewContainer.style.display = 'block';
            startInterviewBtn.style.display = 'none';
            
            generateInterviewQuestions();
            showNextQuestion();
        } else {
            console.error('Interview container not found');
        }
    }

    function generateInterviewQuestions() {
        console.log('Generating questions...');
        
        const questionTemplates = [
            "Can you explain your experience with {skill}?",
            "How would you use {skill} in a real-world project?",
            "What are the key concepts of {skill}?",
            "How do you stay updated with {skill}?",
            "What challenges have you faced while learning {skill}?"
        ];

        interviewQuestions = [];
        analysisResults.missingSkills.forEach(skill => {
            questionTemplates.forEach(template => {
                interviewQuestions.push({
                    skill: skill,
                    question: template.replace('{skill}', skill)
                });
            });
        });

        console.log('Generated questions:', interviewQuestions);
    }

    function showNextQuestion() {
        console.log('Showing next question...');
        
        if (currentQuestionIndex < interviewQuestions.length) {
            const question = interviewQuestions[currentQuestionIndex];
            
            questionContainer.innerHTML = `
                <div class="question-header">
                    <span class="question-number">Question ${currentQuestionIndex + 1}/${interviewQuestions.length}</span>
                    <span class="skill-tag">${question.skill}</span>
                </div>
                <div class="question-text">${question.question}</div>
            `;
            
            userAnswerInput.value = '';
            feedbackContainer.innerHTML = '';
            submitAnswerBtn.style.display = 'block';
            nextQuestionBtn.style.display = 'none';
        } else {
            showInterviewSummary();
        }
    }

    function submitAnswer() {
        const answer = userAnswerInput.value.trim();
        
        if (!answer) {
            alert('Please provide an answer before submitting.');
            return;
        }

        feedbackContainer.innerHTML = `
            <div class="feedback-container">
                <h4>Feedback:</h4>
                <div class="feedback-content">
                    <div class="feedback-strength">
                        <strong>Strengths:</strong><br>
                        Good explanation of concepts and practical application.
                    </div>
                    <div class="feedback-improvement">
                        <strong>Areas for Improvement:</strong><br>
                        Consider adding more specific examples from your experience.
                    </div>
                    <div class="feedback-tips">
                        <strong>Tip:</strong><br>
                        Practice implementing this skill in small projects to gain hands-on experience.
                    </div>
                </div>
            </div>
        `;

        submitAnswerBtn.style.display = 'none';
        nextQuestionBtn.style.display = 'block';
        currentQuestionIndex++;
    }

    function showInterviewSummary() {
        interviewContainer.innerHTML = `
            <div class="interview-summary">
                <h3>Interview Practice Complete!</h3>
                <div class="summary-content">
                    <p>You've practiced questions for the following skills:</p>
                    <ul>
                        ${analysisResults.missingSkills.map(skill => `<li>${skill}</li>`).join('')}
                    </ul>
                    <div class="summary-tips">
                        <h4>General Interview Tips:</h4>
                        <ul>
                            <li>Use the STAR method (Situation, Task, Action, Result)</li>
                            <li>Prepare concrete examples from your experience</li>
                            <li>Practice explaining technical concepts clearly</li>
                            <li>Research the company before the interview</li>
                        </ul>
                    </div>
                </div>
                <button onclick="location.reload()" class="button">Start New Practice</button>
            </div>
        `;
    }
}); 