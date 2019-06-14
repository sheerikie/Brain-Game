import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import RandomNumber from './RandomNumber';

class Game extends Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
  };
  state={
    selectedIds:[0,4],
    remainingSeconds:this.props.initialSeconds,
  };
  randomNumbers = Array.from({ length: this.props.randomNumberCount }).map(
    () => 1 + Math.floor(10 * Math.random())
  );
  gameStatus='PLAYING';
  target = this.randomNumbers
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc+curr, 0);
    
    //shuffle random numbers
    
    componentDidMount(){
     this.intervalId=setInterval(()=>{
        this.setState((prevState)=>{
          return{remainingSeconds:prevState.remainingSeconds-1};
        },()=>{
          if(this.state.remainingSeconds===0){
            clearInterval(this.intervalId);
          }
        });
      },1000);
    }

    
    isNumberSelected=(numberIndex)=>{
      return this.state.selectedIds.indexOf(numberIndex)>=0;
    };
    selectNumber=(numberIndex)=>{
      this.setState((prevState)=>({selectedIds: [...prevState.selectedIds,numberIndex],}));
    };
    UNSAFE_componentWillUpdate(nextProps,nextState){
      if(nextState.selectedIds !==this.state.selectedIds
        ||nextState.remainingSeconds===0){
        this.gameStatus=this.calcGameStatus(nextState);
      }
         }
    componentWillUnmount(){
          clearInterval(this.intervalId);
        }
    //gameStatus: Playing,won,lost
    calcGameStatus=(nextState)=>{
      //alert('calcGameStatus');
      const sumSelected=nextState.selectedIds.reduce((acc,curr)=>{
        return acc + this.randomNumbers[curr];
      },0);
      if(nextState.remainingSeconds===0){
        return 'LOST';
      }
      if(sumSelected<this.target){
        return 'PLAYING';
      }
      if(sumSelected===this.target){
        return 'WON';
      }
      if(sumSelected > this.target){
         return 'LOST';
      }
    };
  
    jewelStyle=()=>{
      const gameStatus=this.calcGameStatus();
      if(gameStatus==='PLAYING'){
      return {
        backgroundColor: '#bbb',
      };
    }
      if(gameStatus==='WON'){
        return {
          backgroundColor: 'green',
      };
    }
      if(gameStatus==='LOST'){
          return {
            backgroundColor: 'red',
      };
    
        }    
      };
    
  render() {
    const gameStatus=this.gameStatus;

  
    return (
      <View style={styles.container}>
        <Text style={[styles.target,this.jewelStyle()]}>{this.target}</Text>
        <Text>{gameStatus}</Text>
        <View style={styles.randomContainer}>
        {this.randomNumbers.map((randomNumber, index)=>(
				<RandomNumber 
          key={index} 
          id={index} 
          number={randomNumber}
          isDisabled={this.isNumberSelected(index)}
          onPress={this.selectNumber}
        />
        ))}
        </View>
        <Text>{this.state.remainingSeconds}</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flex: 1,
  },
  target: {
    fontSize: 50,
    margin: 50,
    textAlign: 'center',
  },
  randomContainer:{
    flex:1,
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'space-around',
  },

  STATUS_PLAYING:{
    backgroundColor: '#bbb',
  },
  STATUS_WON:{
    backgroundColor: 'green',
  },
  STATUS_LOST:{
    backgroundColor: 'red',
  },
});

export default Game;
