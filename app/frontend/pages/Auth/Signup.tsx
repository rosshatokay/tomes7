import { LogoIcon } from "@/assets/LogoIcon"
import { GoogleIcon } from "@/assets/socials/GoogleIcon"
import { LinkUnderline } from "@/components/partials/LinkUnderline"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import BaseLayout from "@/layouts/BaseLayout"
import { Head, Link, useForm } from "@inertiajs/react"

export default function SignupPage({ google_oauth_path }: { google_oauth_path: string }) {
	const { data, setData, processing, errors, clearErrors, post } = useForm({
		user: {
			email: "",
			username: "",
			password: ""
		}
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		post('/signup')
	}

	return (
		<>
			<Head>
				<title>Sign up for free</title>
			</Head>
			<div className="w-full min-h-svh py-8 flex-center">
				<div className="max-w-sm w-full flex flex-col gap-6">
					<LogoIcon />
					<div className="flex flex-col gap-2">
						<h1 className="text-lg leading-none">Create a free Tomes account</h1>
						<p className="text-lg leading-none text-subtle">The greatest books of all time, for free.</p>
					</div>
					<Button size={"lg"} variant={"secondary"} nativeButton={false} render={<Link href={google_oauth_path} />}>
						<GoogleIcon />
						<span>Continue with Google</span>
					</Button>
					<div className="flex gap-3 items-center">
						<span className="h-px w-full bg-foreground/10"></span>
						<span className="leading-none text-sm text-subtle">or</span>
						<span className="h-px w-full bg-foreground/10"></span>
					</div>
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<Field>
								<FieldLabel>Email</FieldLabel>
								<Input
									id="email"
									className="h-9 px-3"
									type="email"
									placeholder="Enter your email"
									// required
									onChange={(e) => {
										setData('user.email', e.target.value.trim())
										clearErrors('user.email')
									}}
									value={data.user.email}
									aria-invalid={!!errors["user.email"]}
								/>
								{errors["user.email"] && <FieldError>{errors["user.email"]}</FieldError>}
							</Field>
							<Field>
								<FieldLabel htmlFor="username">Username</FieldLabel>
								<Input
									id="username"
									className="h-9 px-3"
									placeholder="Enter a username"
									autoComplete="username"
									// required
									onChange={(e) => {
										setData('user.username', e.target.value)
										clearErrors('user.username')
									}}
									aria-invalid={!!errors["user.username"]}
								/>
								{errors["user.username"] && <FieldError>{errors["user.username"]}</FieldError>}
							</Field>
							<Field>
								<FieldLabel htmlFor="password">Password</FieldLabel>
								<Input
									id="password"
									type="password"
									className="h-9 px-3"
									placeholder="Enter a password"
									// required
									autoComplete="off"
									onChange={(e) => {
										setData('user.password', e.target.value)
										clearErrors('user.password')
									}}
									aria-invalid={!!errors['user.password']}
								/>
								{errors["user.password"] && <FieldError>{errors["user.password"]}</FieldError>}
							</Field>
							<Button
								className={"h-9 rounded-lg"}
								type="submit"
								disabled={processing}
								variant={processing ? "ghost" : "default"}
							>
								{processing && <Spinner />}
								<span>Create a free account</span>
							</Button>
						</FieldGroup>
					</form>
					<p className="text-sm text-subtle">Already have an account? <LinkUnderline href="/login" className="text-foreground">Sign in</LinkUnderline></p>
					<p className="text-sm text-subtle">By signing in or creating an account, you agree to our <LinkUnderline href="/terms">Terms of service</LinkUnderline> and <LinkUnderline href="/privacy">Privacy policy</LinkUnderline>.</p>
				</div>
			</div>
		</>
	)
}

SignupPage.layout = (page: React.ReactNode) => <BaseLayout hideHeaderForced={true} hideFooter={true}>{page}</BaseLayout>
