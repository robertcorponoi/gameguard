# **Database**

The GameGuard server uses the MongoDB to manage players with the mongoose package to manage the schemas and other operations. The database connection info has a default value of `mongodb://localhost:27017/gameguard` but you can configure the connection credentials in a `.env` file with a sample connection file provided as `.env.sample`. The database module can be accessed through the `db` property of the GameGuard instance.

## **Table of Contents**

- [API](#api)
  - [clear](#clear)
  - [getBannedPlayers](#getbannedplayers)
  - [updatePlayer](#updateplayer)
  - [banPlayer](#banplayer)

## **API**

The following methods are available through the database operations:

### **clear**

The `clear` method clears all data out of the database. This is not recommended unless you're really sure that you want a fresh start.

**example**

```js
gg.db.clear();
```

### **getBannedPlayers**

Retrieves an array of players from the database that are currently banned.

**example**

```js
async function main() {
    const bannedPlayers = await gg.db.getBannedPlayers().catch(err => console.log(err));
}
```

### **updatePlayer**

Updates any property of the player. You should be careful using this as you can update or add any property of the player including their id or banned status. This method is used internally by GameGuard to create and update players. This can be very useful for you to add or edit custom properties of players like if you would for example add a `isAdmin` property to the player.

| Name   | Type   | Description                                      |
|--------|--------|--------------------------------------------------|
| pid    | string | The id of the player to update in the database.  |
| update | Object | The keys and values of the properties to update. |

**example**

```js
async function main() {
    await gg.db.updatePlayer('player-id-to-update', { isAdmin: true });
}
```

### **getPlayer**

Retrieves a player's object from the database.

**example**

```js
async function main() {
    const player = await gg.db.getPlayer('player-id-to-get');
}
```

### **banPlayer**

Sets a player as banned in the database. This is used internally by GameGuard when `ban` is used on a player.

**example**

```js
async function main() {
    await gg.db.banPlayer('player-id-to-ban');
}
```

### **unbanPlayer**

Sets a player as not banned in the database.

**example**

```js
async function main() {
    await gg.db.unbanPlayer('player-id-to-unban');
}
```