import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import LoginLayout from './layouts/LoginLayout';
import ProtectedLayout from './layouts/ProtectedLayout';

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route
				path="/"
				element={
					<ProtectedLayout>
						<AppLayout />
					</ProtectedLayout>
				}
			>
				<Route
					index
					lazy={async () => {
						const { DashboardPage } = await import(
							'../pages/Dashboard/DashboardPage'
						);

						return { Component: DashboardPage };
					}}
				/>
				<Route
					path="servers/:guildId"
					lazy={async () => {
						const { ServerPage } = await import(
							'../pages/Server/ServerPage'
						);

						return { Component: ServerPage };
					}}
				/>
				<Route
					path="*"
					lazy={async () => {
						const { ErrorPage } = await import(
							'../pages/Error/ErrorPage'
						);

						return { Component: ErrorPage };
					}}
				/>
			</Route>
			<Route
				path="settings"
				element={
					<ProtectedLayout ownerOnly={true}>
						<AppLayout />
					</ProtectedLayout>
				}
			>
				<Route
					index
					lazy={async () => {
						const { SettingsPage } = await import(
							'../pages/Settings/SettingsPage'
						);

						return { Component: SettingsPage };
					}}
				/>
			</Route>
			<Route
				path="login"
				element={
					<ProtectedLayout>
						<LoginLayout />
					</ProtectedLayout>
				}
			>
				<Route
					index
					lazy={async () => {
						const { LoginPage } = await import(
							'../pages/Login/LoginPage'
						);

						return { Component: LoginPage };
					}}
				/>
			</Route>
		</>
	)
);

export default router;
