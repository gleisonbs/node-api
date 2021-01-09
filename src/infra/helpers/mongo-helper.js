const { MongoClient } = require('mongodb')

module.exports = {
  async connect (url) {
    this.url = url
    this.client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    this.db = await this.client.db()
  },
  async disconnect () {
    this.client.close()
    this.client = null
    this.db = null
  },
  async getCollection (name) {
    if (!this.client || !this.client.isConnected()) {
      await this.connect(this.url, this.dbName)
    }
    return this.db.collection(name)
  }
}
