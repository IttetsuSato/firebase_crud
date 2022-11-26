import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    //コレクションの参照
    const usersCollectionRef = collection(db, "users");
    //コレクション内のドキュメントの取得
    // getDocs(usersCollectionRef).then((querySnapshot) => {
    //   setUsers(
    //     querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    //   );
    // });

    //リアルタイムでのデータ取得と、リスナーの削除関数
    const unsub = onSnapshot(usersCollectionRef, (querySnapshot) => {
      setUsers(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    return unsub;

    //idを指定したドキュメントの取得
    // const userDocumentRef = doc(db, "users", "2u3YPeoQgUcCGkJnRAx3");
    // getDoc(userDocumentRef).then((documentSnapshot) => {
    //   if (documentSnapshot.exists()) {
    //     console.log('Document data:', documentSnapshot.data());
    //   } else {
    //     console.log('No such document!');
    //   }
    // });
  }, []);

  //ドキュメントの追加処理
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, email } = event.target.elements;
    const usersCollectionRef = collection(db, "users");
    const documentRef = await addDoc(usersCollectionRef, {
      name: name.value,
      email: email.value,
      timestamp: serverTimestamp()
    });
    console.log(documentRef);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>名前</label>
          <input name="name" type="text" placeholder="名前" />
        </div>
        <div>
          <label>メールアドレス</label>
          <input name="email" type="email" placeholder="メールアドレス" />
        </div>
        <div>
          <button>登録</button>
        </div>
      </form>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}

export default App;
