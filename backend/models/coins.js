import db from '../config/db.js'
const coins = {
   getCoins: async ()=>{
    const result = await db.query('select symbol from coins');
    return result
   }
}
export default coins;