from dotenv import load_dotenv
import json
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITHM = os.getenv("ALGORITHM")

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))


def clean_env_value(value: str | None, default: str = "") -> str:
	if value is None:
		return default
	cleaned = value.strip()
	# Remove surrounding quotes if present
	if len(cleaned) >= 2 and cleaned[0] == cleaned[-1] and cleaned[0] in {"\"", "'"}:
		cleaned = cleaned[1:-1].strip()
	return cleaned


#Validate and parse ADMIN_USERS for seeding
def parse_admin_seed_users() -> list[tuple[str, str]]:
	admin_users_raw = clean_env_value(os.getenv("ADMIN_USERS"))
	if not admin_users_raw:
		raise ValueError(
			"ADMIN_USERS is required. Expected JSON array: "
			"'[{\"username\":\"admin\",\"password\":\"Admin123!\"}]'"
		)

	try:
		parsed_users = json.loads(admin_users_raw)
	except json.JSONDecodeError as exc:
		raise ValueError(
			"Invalid ADMIN_USERS JSON. Expected format: "
			"'[{\"username\":\"admin\",\"password\":\"Admin123!\"}]'"
		) from exc

	if not isinstance(parsed_users, list) or not parsed_users:
		raise ValueError("ADMIN_USERS must be a non-empty JSON array.")

	seed_users: list[tuple[str, str]] = []

	for idx, item in enumerate(parsed_users):
		if not isinstance(item, dict):
			raise ValueError(
				f"Invalid ADMIN_USERS entry at index {idx}. Each entry must be an object."
			)

		raw_username = item.get("username")
		raw_password = item.get("password")

		if not isinstance(raw_username, str) or not isinstance(raw_password, str):
			raise ValueError(
				f"Invalid ADMIN_USERS entry at index {idx}. 'username' and 'password' must be strings."
			)

		username = clean_env_value(raw_username)
		password = clean_env_value(raw_password)

		if not username or not password:
			raise ValueError(
				f"Invalid ADMIN_USERS entry at index {idx}. Username and password must be non-empty."
			)

		seed_users.append((username, password))

	if not seed_users:
		raise ValueError("ADMIN_USERS is set but no valid admin entries were provided.")

	return seed_users


ADMIN_SEED_USERS = parse_admin_seed_users()
