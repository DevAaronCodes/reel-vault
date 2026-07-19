pipeline {
  agent any

  environment {
    TEST_PORT = '3001'
    API_BASE_URL = "http://localhost:${TEST_PORT}"
    TMDB_API_TOKEN = 'test-token'
    NODE_ENV = 'test'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Tool Versions') {
      steps {
        sh 'node --version'
        sh 'npm --version'
        sh 'python3 --version || python --version'
      }
    }

    stage('Install Node Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Install Python Dependencies') {
      steps {
        sh '''
          python3 -m venv .venv || python -m venv .venv
          . .venv/bin/activate
          pip install --upgrade pip
          pip install -r tests/requirements.txt
        '''
      }
    }

    stage('Type Check') {
      steps {
        sh 'npm run typecheck'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Start Test Server') {
      steps {
        sh '''
          mkdir -p reports
          NODE_ENV=test PORT=${TEST_PORT} TMDB_API_TOKEN=${TMDB_API_TOKEN} npm --workspace server run start > reports/server.log 2>&1 &
          echo $! > reports/server.pid
          for i in $(seq 1 30); do
            if curl -fsS ${API_BASE_URL}/api/health > /dev/null; then
              exit 0
            fi
            sleep 1
          done
          cat reports/server.log
          exit 1
        '''
      }
    }

    stage('Pytest') {
      steps {
        sh '''
          . .venv/bin/activate
          pytest tests --junitxml=reports/pytest-results.xml
        '''
      }
    }
  }

  post {
    always {
      sh '''
        if [ -f reports/server.pid ]; then
          kill $(cat reports/server.pid) || true
        fi
      '''
      junit allowEmptyResults: true, testResults: 'reports/pytest-results.xml'
      archiveArtifacts allowEmptyArchive: true, artifacts: 'reports/server.log'
    }
  }
}
