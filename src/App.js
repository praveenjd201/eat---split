import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [showAddFriend, setshowAddFriend] = useState(false);
  // const friends = initialFriends;
  const [friends, setFriends] = useState(initialFriends);

  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setshowAddFriend(!showAddFriend);
  }
  function handleAddFriend(newfriend) {
    setFriends((friends) => [...friends, newfriend]);
    setshowAddFriend(false);
  }

  function handleSelectedFriend(friend) {
    setSelectedFriend((curFriend) =>
      friend.id === curFriend?.id ? null : friend
    );
    setshowAddFriend(false);
  }

  function handleUpdateSplitBalance(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend("");
  }
  // console.log(selectedFriend);
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelectedFriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button className="button" onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onUpdateSplitBalance={handleUpdateSplitBalance}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelectedFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelectedFriend={onSelectedFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, onSelectedFriend, selectedFriend }) {
  const isSelected = friend.id === selectedFriend?.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      <Balance friend={friend} />
      <Button className="button" onClick={() => onSelectedFriend(friend)}>
        {friend.id === selectedFriend?.id ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Balance({ friend }) {
  return (
    <>
      {friend.balance < 0 && (
        <p className="red">
          <span>
            you owe {friend.name} {Math.abs(friend.balance)}💰
          </span>
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          <span>
            {friend.name} owe you {Math.abs(friend.balance)}💰
          </span>
        </p>
      )}
      {friend.balance === 0 && (
        <p>
          <span>you & {friend.name} are even💰</span>
        </p>
      )}
    </>
  );
}

function Button({ children, className, onClick }) {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setimage] = useState("https://api.multiavatar.com/");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;

    const id = crypto.randomUUID();

    const newFriend = { id, name, image: `${image + id}.svg`, balance: 0 };
    console.log(newFriend);
    onAddFriend(newFriend);
    setName("");
    setimage("https://i.pravatar.cc/48?u=");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑🏻‍🤝‍🧑Friend name</label>
      <input
        value={name}
        type="text"
        onChange={(e) => setName(e.target.value)}
      />
      <label>🌅Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setimage(e.target.value)}
      />
      <Button className="button">Add </Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onUpdateSplitBalance }) {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const [whoPay, setWhoPay] = useState("user");
  const friendExpense = bill ? bill - userExpense : "";

  const isSameExpense = userExpense === friendExpense;

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !userExpense) return;

    onUpdateSplitBalance(whoPay === "user" ? friendExpense : -friendExpense);
  }

  console.log(friendExpense);
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>SPLIT A BILL WITH {selectedFriend.name} </h2>
      <label>💸 Bill Value</label>
      <input type="text" onChange={(e) => setBill(Number(e.target.value))} />
      <label>🧍‍♂️Your expense</label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) =>
          setUserExpense(
            bill < Number(e.target.value) ? userExpense : Number(e.target.value)
          )
        }
      />
      <label>🧑🏻‍🤝‍🧑{selectedFriend.name} expense</label>
      <input type="text" value={friendExpense} name="" id="" disabled />
      <label>🤑Who is paying the bill</label>
      <select value={whoPay} onChange={(e) => setWhoPay(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button className="button">Split Bill</Button>
    </form>
  );
}

export default App;
