import { Fragment, useEffect, useState } from 'react';
import { Button, StyleSheet, TextInput, Modal, View, TouchableOpacity, Text, Alert} from 'react-native';
import DataTable, {COL_TYPES} from 'react-native-datatable-component';
import { Formik } from 'formik';
import axios from 'react-native-axios';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [numberPages, setNumberPages] = useState(0);
  const [selected, setSeletected] = useState({});
  const [action, setAction] = useState({});
  const [form, setForm] = useState({
    id: '123',
    name: '',
    cpf: '',
    date_birthday: '',
    state: '',
    city: '',
    gender: '',
  });

  const getAction = (action) => {
    if( action != 'delete' ){
      setAction(action);
      setModalVisible(true);
    }else{
      setModalVisible(false);

      Alert.alert(
        "Aviso",
        "Deseja realmente excluir esse registro?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => deletePost(selected.id) }
        ]
      );
    }
    setForm(selected);
  }

  useEffect(() => {
    getDatas();
  }, []);

  const getDatas = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/client`);
      for (let index = 0; index < res.data.length; index++) {
        res.data[index].actions = '<a>Editar</a>';
      }

      setDataList(res.data);

      var pages = 0;

      if( res.data.length < 0 ){
        pages = res.data.length / 10;
      }

      setNumberPages(Math.ceil(pages));
		} catch (err) {
			alert(err);
		}
  }

  const deletePost = async(id) => {
    await axios.delete('http://127.0.0.1:8000/client/'+id)
    .then(function (response) {
      if( response.data.stats ){
        alert(response.data.msg)
        getDatas();
      }
    })
    .catch(function (error) {
        alert(error);
    });
  }

  const sendPost = async (act, id) => {
    switch (act) {
      case 'update':
        await axios.put('http://127.0.0.1:8000/client/'+selected.id, form)
        .then(function (response) {
          if( response.data.stats ){
            alert(response.data.msg);
            getDatas();
          }
        })
        .catch(function (error) {
            alert(error);
        });
      break;
    default:
      await axios.post('http://127.0.0.1:8000/client/', form)
      .then(function (response) {
        if( response.data.stats ){
          alert(response.data.msg)
          getDatas();
        }
      })
      .catch(function (error) {
          alert(error);
      });
      break;
    }

    setForm({});
    setModalVisible(!modalVisible);
  }

  return (
    <Fragment>
      <View style={{marginTop:40}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Formik
                style={{width: '100%'}}
              >
                <View style={{width: '100%'}}>
                  <TextInput
                    onChangeText={(item) => setForm(prev => ({...prev, name: item}))}
                    placeholder={'Name'}
                    defaultValue={selected.name}
                    style={styles.inputH}
                  />

                  <TextInput
                    onChangeText={(item) => setForm(prev => ({...prev, cpf: item}))}
                    placeholder={'CPF'}
                    defaultValue={selected.cpf}
                    style={styles.inputH}
                  />

                  <TextInput
                    onChangeText={(item) => setForm(prev => ({...prev, date_birthday: item}))}
                    placeholder={'Date of Birthday'}
                    defaultValue={selected.date_birthday}
                    style={styles.inputH}
                  />

                  <TextInput
                    onChangeText={(item) => setForm(prev => ({...prev, state: item}))}
                    placeholder={'State'}
                    defaultValue={selected.state}
                    style={styles.inputH}
                  />

                  <TextInput
                    onChangeText={(item) => setForm(prev => ({...prev, city: item}))}
                    defaultValue={selected.city}
                    placeholder={'City'}
                    style={styles.inputH}
                  />

                  <TextInput
                    onChangeText={(item) => setForm(prev => ({...prev, gender: item}))}
                    placeholder={'IGender'}
                    defaultValue={selected.gender}
                    style={styles.inputH}
                  />

                  <TouchableOpacity
                    onPress={() => sendPost(action)}
                    style={[styles.buttonLargeContainer, styles.primaryButton]}>
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </Formik>
            </View>
          </View>
        </Modal>

        <View style={styles.buttonActions}>
          <Button title="Adicionar" style={styles.buttonAdd} onPress={() => getAction()}/>
          { selected.id != '' && selected.actions ? <Button title="Editar" style={styles.buttonAdd} onPress={() => getAction('update', selected.id)}/> : '' }
          { selected.id != '' && selected.actions ? <Button title="Excluir" style={styles.buttonAdd} onPress={() => getAction('delete', selected.id)}/> : '' }
        </View>

        <DataTable
          onRowSelect={(row) => {setSeletected(row)}}
          data={dataList}
          colNames={['name', 'gender', 'actions']}
          colSettings={[
            { name: 'name', type: COL_TYPES.STRING, width: '50%' }, 
            { name: 'gender', type: COL_TYPES.STRING, width: '30%' },
            { name: 'actions', type: COL_TYPES.CHECK_BOX, width: '30%' }
          ]}
          noOfPages={2}
          backgroundColor={'rgba(23,2,4,0.2)'}
          headerLabelStyle={{ color: 'grey', fontSize: 12 }}
      />

    </View>
  </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredFV: {
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    backgroundColor: "#ffffff",
    width: '100%',
    height: '90%',
    borderRadius: 0,
    padding: 35,
    marginBottom: -60,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    zIndex: 9999999
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  buttonLargeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  primaryButton: {
      backgroundColor: '#FF0017',
    },
  buttonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
      width: '100%',
      backgroundColor: '#000',
      marginTop: 40,
      height: 50,
      textAlign: 'center',
      lineHeight: 50
    },
    inputH: {
      borderColor: '#efefef',
      padding: 20,
      borderWidth: 1,
      width: '100%'
    },

    buttonActions:{
      flexDirection: 'row',
      justifyContent: 'space-between',
    }


});
