pipeline {
    agent any

    environment {
        DB_URL = credentials('DB_URL')
        PORT = credentials('PORT')
        JWT_ACCESS_SECRET = credentials('JWT_ACCESS_SECRET')
        JWT_REFRESH_SECRET = credentials('JWT_REFRESH_SECRET')
        CLOUDINARY_CLOUD_NAME = credentials('CLOUDINARY_CLOUD_NAME')
        CLOUDINARY_API_KEY = credentials('CLOUDINARY_API_KEY')
        CLOUDINARY_API_SECRET = credentials('CLOUDINARY_API_SECRET')
    }

    stages {

        stage('Create .env') {
            steps {
                sh '''
                mkdir -p backend

                cat > backend/.env <<EOF
DB_URL=${DB_URL}
PORT=${PORT}
JWT_ACCESS_SECRET=${JWT_ACCESS_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}
EOF
                '''
            }
        }

        stage('Stop Old Containers') {
            steps {
                sh 'docker compose down || true'
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                cd backend
                npm ci
                npm test
                '''
            }
        }

        stage('Build Containers') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Run Containers') {
            steps {
                sh 'docker compose up -d'
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