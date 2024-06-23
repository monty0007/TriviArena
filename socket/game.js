class Game{
    constructor(player, gameId){
       this.GameId = gameId
       this.Host = player
       this.InGameUsers = [player]
    }

    // player, user : {
    //     id : socket,
    //     code : String,
    //     isHost : Boolean
    // }

    addUsers(user){
       if(user.code === this.GameId){
        this.InGameUsers.push(user)
        console.log('total in game users are : ', this.InGameUsers.length)
       }
    }

    removeUser(userToRemove){
        const updatedInGameUsers = this.InGameUsers.filter(user => user.id !== userToRemove.id)
        if(updatedInGameUsers){
            this.InGameUsers = updatedInGameUsers
            console.log('total users in game :', this.InGameUsers.length)
        }
    }

    gameHandler(){
        //todo : all room handling logic
    }
}

module.exports=Game