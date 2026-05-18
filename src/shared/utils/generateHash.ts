import bcrypt from 'bcrypt';

async function run(){
    const hash = bcrypt.hash('2324', 10);
    console.log( await(hash))
}

run();