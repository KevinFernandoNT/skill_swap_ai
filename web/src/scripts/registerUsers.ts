import api from '../lib/api';

// Sample data for generating random users
const firstNames = [
  'Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Quinn', 'Avery', 'Blake', 'Cameron',
  'Drew', 'Emery', 'Finley', 'Gray', 'Harper', 'Indigo', 'Jamie', 'Kendall', 'Logan', 'Mason'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
];

const skills = [
  'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 'TypeScript', 'Vue.js', 'Angular', 'PHP',
  'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Dart', 'Flutter', 'Django', 'Express.js', 'Laravel'
];

const locations = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA',
  'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL',
  'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC', 'San Francisco, CA', 'Indianapolis, IN',
  'Seattle, WA', 'Denver, CO', 'Washington, DC'
];

const avatarUrls = [
  'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomUser(index: number) {
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(lastNames);
  const name = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@example.com`;
  const password = 'Password123!';
  const location = getRandomElement(locations);
  const avatar = getRandomElement(avatarUrls);

  return {
    name,
    firstName,
    lastName,
    email,
    password,
    address: location,
    avatar
  };
}

async function registerUser(userData: any, index: number) {
  try {
    console.log(`Registering user ${index + 1}: ${userData.name} (${userData.email})`);
    
    const response = await api.post('/auth/register', userData);
    
    console.log(`✅ Successfully registered: ${userData.name}`);
    return { success: true, user: userData, response: response.data };
  } catch (error: any) {
    console.error(`❌ Failed to register ${userData.name}:`, error.response?.data?.message || error.message);
    return { success: false, user: userData, error: error.response?.data?.message || error.message };
  }
}

async function registerMultipleUsers(count: number = 20) {
  console.log(`🚀 Starting registration of ${count} users...\n`);
  
  const results = [];
  
  for (let i = 0; i < count; i++) {
    const userData = generateRandomUser(i);
    const result = await registerUser(userData, i);
    results.push(result);
    
    // Add a small delay between requests to avoid overwhelming the server
    if (i < count - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // Summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`\n📊 Registration Summary:`);
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((successful / count) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log(`\n❌ Failed registrations:`);
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.user.name} (${r.user.email}): ${r.error}`);
    });
  }
  
  return results;
}

// Export for use in other files
export { registerMultipleUsers, generateRandomUser };

// If running directly, execute the registration
if (typeof window !== 'undefined') {
  // Browser environment - can be called from console
  (window as any).registerUsers = registerMultipleUsers;
  console.log('💡 To register users, run: window.registerUsers(20)');
} else {
  // Node.js environment
  registerMultipleUsers(20).then(() => {
    console.log('🎉 User registration completed!');
  }).catch(error => {
    console.error('💥 Registration failed:', error);
  });
} 