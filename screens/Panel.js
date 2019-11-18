import React, {Component} from 'react';
import { View, TouchableOpacity, Text, FlatList, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import fire from "../constants/firebaseConfigrations";

export default class MyPanel extends Component{

    constructor(props) {
        super(props);
        this.getData=this.getData.bind(this);
        this.state = { 
          data: props.data,
          expanded : false,
          expanded2:false,
          patientInfo:[],
          noInfo:false,
          date:'',
          time:'',
          clinic:'',
          available:false,
          idDoctor:"",
          idPatient:'',
        }
    }
  
    componentDidMount(){
      this.getData();
    }
    getData(){

      const { navigation } = this.props;  
    var idP=navigation.getParam('id');
    var idD=navigation.getParam('idDoctor');
    var t=navigation.getParam('type');

    var date=navigation.getParam('date');
    var time=navigation.getParam('time');
    var clinic=navigation.getParam('clinic');
    var av=navigation.getParam('available');

    this.setState({
      idPatient:idP,
      idDoctor:idD,
      type:t,
      date:date,
      time:time,
      clinic:clinic,
      available:av
    })
      fire.database().ref("users").child(idD).child("patients").on('value',(snapshot)=>{
        if(snapshot.val()){
           let data = Object.values(snapshot.val());
       this.setState({
         patientInfo:data,
         noInfo:false
       })
        }
       
        else{
            this.setState({
             noInfo:true
            })
        }
   
      })
    }
  render() {

    return (
       <View>
            <TouchableOpacity style={styles.row} onPress={()=>this.toggleExpand()}>
                <Text style={[styles.title]}>press</Text>
                <Icon name={this.state.expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color="#333" />
            </TouchableOpacity>
            <View style={styles.parentHr}/>
            {
                this.state.expanded &&
                <View style={{}}>
                    <FlatList
                    data={this.state.patientInfo}
                    numColumns={1}
                    scrollEnabled={false}
                    renderItem={({item, index}) => 
                        <View>
                            <TouchableOpacity style={[styles.childRow, styles.button, item.value ? styles.btnInActive : styles.btnActive]} 
                            onPress={()=>this.setState({expanded2 : !this.state.expanded2})}
                            >
                                <Text style={[styles.font, styles.itemInActive]} >{item.sessionNumber}</Text>
                                <Icon name={'check-circle'} size={24} color={ item.value ? "#eee" : "#388E3C"} />
                            </TouchableOpacity>
                            {this.state.expanded2 && <View style={{flexDirection:'column'}}>
                            <Text style={[styles.font, styles.itemInActive]} >{item.money}</Text>
                            <Text style={[styles.font, styles.itemInActive]} >{item.medicine}</Text>
                            <Text style={[styles.font, styles.itemInActive]} >{item.process}</Text>

                            </View>}
                            <View style={styles.childHr}/>
                        </View>
                    }/>
                </View>
            }
            
       </View>
    )
  }

  onClick=(index)=>{
    const temp = this.state.patientInfo.slice()
    temp[index].value = !temp[index].value
    this.setState({patientInfo: temp})
  }

  toggleExpand=()=>{
    this.setState({expanded : !this.state.expanded})
  }

}

const styles = StyleSheet.create({
    container:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    button:{
        width:'100%',
        height:54,
        alignItems:'center',
        paddingLeft:35,
        paddingRight:35,
        fontSize: 12,
    },
    title:{
        fontSize: 14,
        fontWeight:'bold',
        color: "#333",
    },
    itemActive:{
        fontSize: 12,
        color: "#388E3C",
    },
    itemInActive:{
        fontSize: 12,
        color: "#333",
    },
    btnActive:{
        borderColor: "#388E3C",
    },
    btnInActive:{
        borderColor: "#333",
    },
    row:{
        flexDirection: 'row',
        justifyContent:'space-between',
        height:56,
        paddingLeft:25,
        paddingRight:18,
        alignItems:'center',
        backgroundColor: "#eee",
    },
    childRow:{
        flexDirection: 'row',
        justifyContent:'space-between',
        backgroundColor: "#eee",
    },
    parentHr:{
        height:1,
        color: "#fff",
        width:'100%'
    },
    childHr:{
        height:1,
        backgroundColor: "#eee",
        width:'100%',
    },
    colorActive:{
        borderColor: "#388E3C",
    },
    colorInActive:{
        borderColor: "#333",
    }
    
});