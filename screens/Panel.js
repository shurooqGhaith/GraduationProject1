import * as React from 'react';
import {Text} from 'react-native';
import { DataTable } from 'react-native-paper';
import fire from "../constants/firebaseConfigrations";

export default class MyPanel extends React.Component {
  
  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
    this.state={
      page:0,
      numberOfPages:'',
      perPage:8,
      id:'',
      appointment:[],
      noDate:false,
     
    }
  }
  componentDidMount(){
    this.authListener();
    }
  
  authListener(){
    const { navigation } = this.props;  
    var id=navigation.getParam('idPatient');

    this.setState({id:id});
    var a=[];
    var n;
    fire.database().ref("users").child(id).child("appointment").on('value',(snap)=>{
      if(snap.val()){
        let app=Object.values(snap.val());
        a=app;
        
        n=Math.ceil(a.length / 8)
        console.log(a.length);
        this.setState({
          numberOfPages:n,
          appointment:app,
          noDate:false
        })
      }
      else{
          this.setState({
            noDate:true
          })
      }
    })
  }
  render() {
    return (
      <DataTable>
        <DataTable.Header>
          <DataTable.Title >Date</DataTable.Title>
          <DataTable.Title >Time</DataTable.Title>
          <DataTable.Title >Clinic</DataTable.Title>
        </DataTable.Header>

     

       

        {this.state.appointment
        .slice(this.state.perPage * this.state.page, this.state.perPage * (this.state.page + 1))
        .map((item, i) => {
          return (
            <DataTable.Row >
              
                  <DataTable.Cell >
                    <Text>{item.dateSelected}</Text>
                  </DataTable.Cell>

                  <DataTable.Cell >
                    <Text>{item.dateSelected}</Text>
                  </DataTable.Cell>

                  <DataTable.Cell >
                    <Text>{item.dateSelected}</Text>
                  </DataTable.Cell>
               
              
            </DataTable.Row>
          );
        })}
        
        <DataTable.Pagination
          page={this.state.page}
          numberOfPages={this.state.numberOfPages}
          onPageChange={page => {
          console.log('change', page);
          this.setState({ ...this.state, page });
        }}
        label={this.state.page + 1 + ' of ' + this.state.numberOfPages}
        />
      </DataTable>
    );
  }
}