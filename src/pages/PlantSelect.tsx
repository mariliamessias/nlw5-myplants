import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { EnvironmentButton } from "../components/EnvironmentButton";

import { Header } from "../components/Header";
import { PlantCardPrimary } from "../components/PlantCardPrimary";
import { Load } from "../components/Load";

import api from "../services/api";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { useNavigation } from "@react-navigation/core";
import { PlantProps } from "../libs/storage";

//tipando o retorno da api
interface EnvironmentProps {
  key: string;
  title: string;
}

//tipando o retorno da api que vem da api, então para retirar da api só o que queremos
// interface PlantProps {
//   id: string;
//   name: string;
//   about: string;
//   water_tips: string;
//   photo: string;
//   environments: [string];
//   frequency: {
//     times: number;
//     repeat_every: string;
//   };
// }

export function PlantSelect() {
  const [environments, setEnvironments] = useState<EnvironmentProps[]>([]);
  const [plants, setPlants] = useState<PlantProps[]>([]);
  //estado auxiliar para os filtros
  const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
  const [environmentsSelected, setEnvironmentsSelected] = useState("all");
  const [loading, setLoading] = useState(true);

  //paginação
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  //navegação
  const navigation = useNavigation();

  async function fetchPlants() {
    const { data } = await api.get(
      `plants?_sort=name&_order=asc&_page=${page}&_limit=8`
    );

    if (!data) return setLoading(true);

    if(page > 1){
        setPlants(oldValue => [...oldValue, ...data]);
        setFilteredPlants(oldValue => [ ...oldValue, ...data]);
    }else{
      setPlants(data);
      setFilteredPlants(data);
    }
    //para mostrar a animação da tela
    setLoading(false);

    //para mostrar a animação de carregar mais itens
    setLoadingMore(false);
  }

  function handleEnvironmentSelected(environment: string) {
    setEnvironmentsSelected(environment);

    if (environment === "all") return setFilteredPlants(plants);

    //verificar nos ambientes da planta se este está incluso
    const filtered = plants.filter((plant) =>
      plant.environments.includes(environment)
    );

    setFilteredPlants(filtered);
  }

  function handleFetchMore(distance : number){
      //rolando para cima
      if(distance < 1) return;

      setLoadingMore(true);
      setPage(oldValue => oldValue + 1);
      fetchPlants();

  }

  function handlePlantSelect(plant: PlantProps){
    navigation.navigate('PlantSave', { plant });
  }

  //chamado antes de montar a tela
  useEffect(() => {
    async function fetchEnvironmen() {
      const { data } = await api.get(
        "plants_environments?_sort=title&_order=asc"
      );
      setEnvironments([
        {
          key: "all",
          title: "Todos",
        },
        ...data,
      ]);
    }

    fetchEnvironmen();
  }, []);

  //chamado antes de montar a tela
  useEffect(() => {
    fetchPlants();
  }, []);

  if (loading) return <Load />;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
        <Text style={styles.title}>Em qual ambiente</Text>
        <Text style={styles.subtitle}>você quer colocar sua planta?</Text>
      </View>
      <View>
        <FlatList
          renderItem={({ item }) => (
            <EnvironmentButton
              title={item.title}
              active={item.key === environmentsSelected}
              onPress={() => handleEnvironmentSelected(item.key)}
            />
          )}
          data={environments}
          keyExtractor={(item) => String(item.key)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.environmentList}
        />
      </View>
      <View style={styles.plants}>
        <FlatList
          data={filteredPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardPrimary data={item} onPress={() => handlePlantSelect(item)}/>
          )
          }
          showsVerticalScrollIndicator={false}
          numColumns={2}
          //quando o usuário chegar em 10% do final da tela
          onEndReachedThreshold={0.1}
          //o que fazer quando isso ocorrer
          onEndReached={({distanceFromEnd}) => handleFetchMore(distanceFromEnd)}
          ListFooterComponent={
              loadingMore 
              ? <ActivityIndicator color={colors.green}/>
              : <></>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15,
  },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading,
  },
  environmentList: {
    height: 40,
    justifyContent: "center",
    paddingBottom: 5,
    marginLeft: 32,
    marginVertical: 32,
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
  },
});
