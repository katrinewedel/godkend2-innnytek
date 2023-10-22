import { StyleSheet, View } from 'react-native';
import * as React from 'react';
import { Searchbar } from 'react-native-paper';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { child, get, getDatabase, onValue, ref } from 'firebase/database';

export default function ShopsScreen() {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [shops, onChangeShops] = React.useState<any[]>([]);
    const [groupedShops, onChangeGroupedShops] = React.useState<any>({});

    React.useEffect(() => {
        const db = getDatabase();
        const dbRef = ref(db);
        get(child(dbRef, `shops`)).then((snapshot) => {
            onChangeShops(snapshot.val());

            // Group shops by category
            let groupedShops: any = {};
            snapshot.val().forEach((shop: any) => {
                for (let i = 0; i < shop.categories.length; i++) {
                    if (!groupedShops[shop.categories[i]]) {
                        groupedShops[shop.categories[i]] = [];
                    }
                    groupedShops[shop.categories[i]].push(shop);
                }
            });
            onChangeGroupedShops(groupedShops);
        }).catch((error) => {
            console.error(error);
        });
    }, [false]);

    return (
        <View className='m-4'>
            <Searchbar
                placeholder="Search"
                value={searchQuery}
            />

            <Text className='mt-4' variant="displaySmall">Choose category</Text>
            {
                Object.keys(groupedShops).map((category: string) => {
                    return (
                        <Card className='mt-4' key={category}>
                            <Card.Title title={category} left={(props) => <Avatar.Icon {...props} icon="store" />} />
                            <Card.Content>
                                <Text variant="bodyMedium">There are {groupedShops[category].length} shops in this category</Text>
                            </Card.Content>
                        </Card>
                    );
                })
            }
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});