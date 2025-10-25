export type Employee = {
	first_name: string;
	last_name: string;
};

export type User = {
	id: string;
	username: string;
	is_superuser: boolean;
	created_at: string;
	employee?: Employee;
};

export type Session = {
	user: User;
	accessToken: string;
};

export type AuthTokens = {
	accessToken: string;
	refreshToken: string;
};
