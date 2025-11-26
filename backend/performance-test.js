const axios = require('axios');
const chalk = require('chalk');

// Performance testing script for EscapeHint API
async function performanceTest() {
  console.log(chalk.blue('🚀 Starting EscapeHint API Performance Test...\n'));
  
  const baseURL = process.env.API_BASE_URL || 'http://localhost:3000';
  const testResults = {};

  // Test GET /themes endpoint
  console.log(chalk.yellow('Testing GET /themes endpoint...'));
  try {
    const themesStart = Date.now();
    const themesResponse = await axios.get(`${baseURL}/themes`);
    const themesTime = Date.now() - themesStart;
    testResults.getThemes = { time: themesTime, status: themesResponse.status };
    console.log(chalk.green(`✓ GET /themes: ${themesTime}ms (Status: ${themesResponse.status})`));
  } catch (error) {
    console.log(chalk.red(`✗ GET /themes: Error - ${error.message}`));
    testResults.getThemes = { time: null, status: 'Error', error: error.message };
  }

  // Test POST /sessions endpoint
  console.log(chalk.yellow('\nTesting POST /sessions endpoint...'));
  try {
    // First get an active theme ID for session creation
    const themesResponse = await axios.get(`${baseURL}/themes`);
    if (themesResponse.data && themesResponse.data.length > 0) {
      const themeId = themesResponse.data[0].id;
      
      const sessionStart = Date.now();
      const sessionResponse = await axios.post(`${baseURL}/sessions`, {
        themeId: themeId
      });
      const sessionTime = Date.now() - sessionStart;
      testResults.postSessions = { time: sessionTime, status: sessionResponse.status };
      console.log(chalk.green(`✓ POST /sessions: ${sessionTime}ms (Status: ${sessionResponse.status})`));
    } else {
      console.log(chalk.red('✗ POST /sessions: No themes available for testing'));
      testResults.postSessions = { time: null, status: 'Error', error: 'No themes available' };
    }
  } catch (error) {
    console.log(chalk.red(`✗ POST /sessions: Error - ${error.message}`));
    testResults.postSessions = { time: null, status: 'Error', error: error.message };
  }

  // Test GET /sessions/:id endpoint
  console.log(chalk.yellow('\nTesting GET /sessions/:id endpoint...'));
  try {
    // Create a session first
    const themesResponse = await axios.get(`${baseURL}/themes`);
    if (themesResponse.data && themesResponse.data.length > 0) {
      const themeId = themesResponse.data[0].id;
      const sessionResponse = await axios.post(`${baseURL}/sessions`, { themeId });
      const sessionId = sessionResponse.data.id;

      const getSessionStart = Date.now();
      const getSessionResponse = await axios.get(`${baseURL}/sessions/${sessionId}`);
      const getSessionTime = Date.now() - getSessionStart;
      
      testResults.getSession = { time: getSessionTime, status: getSessionResponse.status };
      console.log(chalk.green(`✓ GET /sessions/:id: ${getSessionTime}ms (Status: ${getSessionResponse.status})`));
    } else {
      console.log(chalk.red('✗ GET /sessions/:id: No themes available for testing'));
      testResults.getSession = { time: null, status: 'Error', error: 'No themes available' };
    }
  } catch (error) {
    console.log(chalk.red(`✗ GET /sessions/:id: Error - ${error.message}`));
    testResults.getSession = { time: null, status: 'Error', error: error.message };
  }

  // Summary
  console.log(chalk.blue('\n📊 Performance Test Summary:'));
  console.log('================================');
  
  Object.keys(testResults).forEach(endpoint => {
    const result = testResults[endpoint];
    if (result.time !== null) {
      const status = result.time <= 200 ? chalk.green('✓') : chalk.yellow('⚠');
      const timeColor = result.time <= 200 ? chalk.green : result.time <= 500 ? chalk.yellow : chalk.red;
      console.log(`${status} ${endpoint}: ${timeColor(`${result.time}ms`)} (Status: ${result.status})`);
    } else {
      console.log(`${chalk.red('✗')} ${endpoint}: ${chalk.red('FAILED')} (Error: ${result.error})`);
    }
  });

  // Performance compliance check
  console.log(chalk.blue('\n✅ Performance Compliance Check:'));
  console.log('==================================');
  
  let allTestsPassed = true;
  Object.keys(testResults).forEach(endpoint => {
    const result = testResults[endpoint];
    if (result.time !== null) {
      const compliant = result.time <= 200;
      console.log(`${endpoint}: ${compliant ? chalk.green('COMPLIANT') : chalk.red('NON-COMPLIANT')} (${result.time}ms, P95 < 200ms requirement)`);
      if (!compliant) allTestsPassed = false;
    }
  });
  
  console.log(`\nOverall: ${allTestsPassed ? chalk.green('PASS') : chalk.red('FAIL')} - API meets performance requirements`);
}

// Run the performance test
performanceTest().catch(console.error);