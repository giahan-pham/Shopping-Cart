import UserCartCard from "./UserCartCard";

import "./styles/UserCartList.css";

function UserCartList({ userCarts }) {
	return (
		<section className="user-cart-list">
			{userCarts.map((userCart) => (
				<UserCartCard key={userCart.user_id} userCart={userCart} />
			))}
		</section>
	);
}

export default UserCartList;
