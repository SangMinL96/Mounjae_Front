import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLogOut } from '../../../component/AuthProvider';
import styled from 'styled-components/native';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import axios from 'axios';
import {Alert}from "react-native"
import { useNavigation } from '@react-navigation/native';
import { HOST_IP } from '../../../config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Input } from 'react-native-elements';
import { NAME_CHECK,NAME_EDIT } from './Query';
import Toast from 'react-native-toast-message';


function MyInfo({age,avatar,id,name,rDate}) {
  const [nameEdit, setNameEdit] = useState(false);
  const [nameCheckMt] = useMutation(NAME_CHECK);
  const [nameEditMt] = useMutation(NAME_EDIT);
  const [nameState,setNameState] = useState(name)

  useEffect(() => {}, [nameState]);

  const onEdit =async (ev) => {
    const name =  ev.nativeEvent.text
    const rslt = await nameCheckMt({ variables: { name} });
    if (rslt?.data?.nameCheck?.rslt === 'NG') {
      Toast.show({ text1: '중복된 닉네임이 존재합니다.', type: 'error' });
    }else{
        const rslt = await nameEditMt({variables:{name}})
        if(rslt?.data?.userNameEdit?.rslt ==="OK"){
            Toast.show({ text1: '성공적으로 닉네임 변경하였습니다.' });
            setNameState(name)
        }
    }   
  }
  return (
    <MyInfoScreen>
      <TouchableOpacity onPress={(ev) => console.log(ev)}>
        <MyAvatar resizeMode="cover" source={{ uri: `${HOST_IP}image/?fn=avatar_1611189426211` }} />
      </TouchableOpacity>
      {nameEdit ? (
        <Input
          containerStyle={{ width: 200 }}
          inputContainerStyle={{ height: 40 }}
          defaultValue={nameState}
          inputStyle={{ fontSize: 14 }}
          placeholder="닉네임"
          onSubmitEditing={onEdit}
          onBlur={()=>setNameEdit(false)}
          autoFocus={true}
        />
      ) : (
        <MyName>
          {nameState}
          <TouchableOpacity onPress={() => setNameEdit(true)}>
            <Icons name="cog-outline" size={18} />
          </TouchableOpacity>
        </MyName>
      )}

      <MyInfoText>생성날짜: {rDate} </MyInfoText>
      <MyInfoText>아이디: {id} | 나이: {age} </MyInfoText>
    </MyInfoScreen>
  );
}

export default MyInfo;

const MyInfoScreen = styled.View`
  width: 100%;
  height: 220px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;


const MyAvatar = styled.Image`
  border-radius: 50px;
  width: 110px;
  height: 110px; ;
`;
const MyName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
`;
const MyInfoText = styled.Text`
  font-size: 10px;
  color: gray;
`;

const InputBox = styled.View`
position: relative;
`;

const InputBtn = styled.TouchableOpacity`
position: absolute;
display: flex;
justify-content: center;
align-items: center;
right: 3%;
top: 22px;
width: 52px;
background-color: #3498db;
height: 20px;
border-radius: 10px;
`;
const InputText = styled.Text`
font-size: 10px;
font-weight: 500;
color: white;
`;