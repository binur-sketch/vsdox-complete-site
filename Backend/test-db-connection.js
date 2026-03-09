import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://postgres:root@localhost:5432/vsdox',
});

async function checkAdminUser() {
  try {
    const res = await pool.query("SELECT email FROM users WHERE email = 'admin@vsdox.com'");
    if (res.rowCount > 0) {
      console.log('✅ Admin user "admin@vsdox.com" exists in the database.');
    } else {
      console.log('❌ Admin user "admin@vsdox.com" NOT FOUND. Creating it...');
      // Password is 'admin', hashed using bcrypt with 12 rounds (compatible with your dump)
      const hash = '$2a$12$xb.8ESQCBWoXyiqAwb8VBe6H.T.07b1c3FVaSLUrf7htp7wdBUQJq';
      await pool.query(
        "INSERT INTO users (name, email, password_hash, role) VALUES ('Admin User', 'admin@vsdox.com', $1, 'admin')",
        [hash]
      );
      console.log('✅ Admin user created successfully.');
    }
  } catch (err) {
    console.error('Error checking user:', err.message);
  } finally {
    await pool.end();
    process.exit();
  }
}

checkAdminUser();
