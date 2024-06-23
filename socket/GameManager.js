const game = require('./game')

class GameManager{
    constructor(){
        this.games = []
        this.users = []
    }

    // player : {
    //     id : socket,
    //     code : String,
    //     isHost : Boolean
    // }

    addUser(newUser){
        const user = this.users.find((user)=>user.id === newUser.id)
        if(!user){
          this.users.push(newUser)
          console.log('total users online : ',this.users.length )
          return
        }
        console.log('user with this id already exists')
    }

    createNewGame(player){
        if(this.games.length > 0){
            //todo : check if user is already in any room or not
        }
        const gameId = Math.floor(100000 + Math.random()*900000)
        const newGame = new game(player, gameId)
        this.games.push(newGame)
    }

    addHandler(player){
        if(player.isHost){
            const game = this.createNewGame(player)
            if(game){
                console.log('create game with gameId : ', game.GameId)
                return
            }
            console.log('error creating room')
            return
        }
        if(!player.isHost){
            const existingGame = this.games.find((game)=>game.GameId === player.code)
            if(!existingGame){
                console.log('No such room exist')
                return
            }
            existingGame.addUsers(player)
        }

    }

    removeUser(player){
        const existingGame = this.games.find((game)=>game.GameId === player.code)
        if(!existingGame){
            console.log('some error occured')
            return
        }
        if(!player.isHost){
            existingGame.removeUser(player)
            const updatedusers = this.users.filter(user=> user.id !== player.id)
            if(updatedusers){
                this.users = updatedusers
            }
            console.log('total users online : ',this.users.length )
        }
        if(player.isHost){
           // todo : delete game
        }
    }

}

module.exports=GameManager