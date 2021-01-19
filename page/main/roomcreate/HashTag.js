import React, { useEffect, useRef, useState } from 'react';
import { HeaderBackButton } from '@react-navigation/stack';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ReactChipsInput from 'react-native-chips';
import TagChip from '../../../component/TagChip';
import { useMutation } from '@apollo/react-hooks';
import { SAVE_ROOM } from './Query';
import { ActivityIndicator } from 'react-native';

function HashTag({ route }) {
  const [loading, setLoading] = useState(false);
  const [saveMt] = useMutation(SAVE_ROOM);
  const navigation = useNavigation();
  const [createData, setCreateData] = useState({ ...route.params, tag: '' });
  const [chip, setChip] = useState([]);
  const chipId = useRef(1);

  useEffect(() => {
    if (chip?.length > 0) {
      chip.map((item) => setCreateData((props) => ({ ...props, tag: props.tag + item.chips })));
    }

    navigation.setOptions({
      header: () => {}
    });
  }, [navigation, chip]);

  const onSetChip = (chips) => {
    setChip((props) => props?.concat({ id: chipId.current, chips: `#${chips}` }));

    chipId.current += 1;
  };

  const onSubmit = async () => {
    setLoading(true)
    try {
      const rslt = await saveMt({ variables: { param: { ...createData, masterid: '' } } });
      console.log(rslt);
      if (rslt?.data?.saveRoom?.rslt === 'OK') {
        setLoading(false)
        navigation.navigate('Tebs');
      }
    } catch (err) {}
  };
  return (
    <>
      {loading ? (
      <RoomCreateView>
          <RoomCreateBg resizeMode="stretch" source={require('../../../Image/hashTagImg.jpg')}>
          <ActivityIndicator size="large" color="#d400ff" />
         </RoomCreateBg>
        </RoomCreateView>
      ) : (
        <RoomCreateView>
          <RoomCreateBg resizeMode="stretch" source={require('../../../Image/hashTagImg.jpg')}>
            <RoomCreateHeader>
              <TouchableOpacity onPress={() => navigation.navigate('Tebs')}>
                <MaterialCommunityIcons name="close" color={'white'} size={26} />
              </TouchableOpacity>
              <Text style={{ color: 'white', fontSize: 18 }}>해쉬 태그</Text>
              <TouchableOpacity onPress={onSubmit}>
                <Text style={{ color: 'white', fontSize: 18 }}>생성</Text>
              </TouchableOpacity>
            </RoomCreateHeader>
            <TagView>
              <ReactChipsInput
                label="해쉬 태그를 입력해주세요."
                onChangeChips={onSetChip}
                inputStyle={{
                  fontSize: 16,
                  width: '100%',
                  color: 'white',
                  borderBottomColor: 'white',
                  borderBottomWidth: 1,
                  marginTop: 10,
                  marginBottom: 10
                }}
                labelStyle={{ color: 'white', fontSize: 18 }}
                labelOnBlur={{ color: 'white', fontSize: 18 }}
              />
              <ChipView style={{ width: '100%' }}>
                {chip?.map((item) => (
                  <TagChip key={item.id} text={item.chips}>
                    <TouchableOpacity
                      onPress={(ev) => setChip((props) => props?.filter((chip) => chip.id !== item.id))}
                    >
                      <Text style={{ backgroundColor: 'gray', borderRadius: 20, marginLeft: 5, top: 2.5 }}>
                        <MaterialCommunityIcons name="close" color={'black'} size={13} />
                      </Text>
                    </TouchableOpacity>
                  </TagChip>
                ))}
              </ChipView>
            </TagView>
          </RoomCreateBg>
        </RoomCreateView>
      )}
    </>
  );
}

export default HashTag;
const RoomCreateView = styled.View`
  flex: 1;
  background-color: #242424;
`;
const TagView = styled.View`
  width: 80%;
`;
const ChipView = styled.View`
  width: 280px;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const RoomCreateBg = styled.ImageBackground`
  flex: 1;
  opacity: 0.7;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const RoomCreateHeader = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  align-items: center;
  position: absolute;
  top: 40px;
  opacity: 1; ;
`;
