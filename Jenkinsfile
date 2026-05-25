pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                checkout scm
            }
        }

        stage('Stop Old Containers') {
            steps {
                sh '''
                docker compose down || true
                '''
            }
        }

        stage('Build Containers') {
            steps {
                sh '''
                docker compose build
                '''
            }
        }

        stage('Run Containers') {
            steps {
                sh '''
                docker compose up -d
                '''
            }
        }

    }

    post {

        success {
            echo 'PetCare deployment successful'
        }

        failure {
            echo 'PetCare deployment failed'
        }

    }
}