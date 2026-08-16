import { LogoIcon } from "@/assets/LogoIcon";
import { GoogleIcon } from "@/assets/socials/GoogleIcon";
import { LinkUnderline } from "@/components/partials/LinkUnderline";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import BaseLayout from "@/layouts/BaseLayout";
import { Head, useForm } from "@inertiajs/react";

export default function LoginPage() {
	const { data, setData, post, processing, errors, clearErrors } = useForm({
		email: "",
		password: ""
	})

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		post("/session")
	}

	return (
		<>
			<Head>
				<title>Log in</title>
				<meta name="description" content="Log in to your Tomes account."></meta>
			</Head>
			<div className="w-full min-h-svh py-8 flex-center">
				<div className="max-w-sm w-full flex flex-col gap-6">
					<LogoIcon />
					<div className="flex flex-col gap-2">
						<h1 className="text-lg leading-none">Welcome back to Tomes</h1>
						<p className="text-lg leading-none text-subtle">The details behind great design</p>
					</div>
					<Button size={"lg"} variant={"secondary"}>
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
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									className="h-9 px-3"
									placeholder="Enter your email"
									type="email"
									required
									onChange={(e) => {
										setData('email', e.target.value)
										clearErrors('email')
									}}
									value={data.email}
									aria-invalid={!!errors.email}
								/>
								{errors.email && <FieldError>{errors.email}</FieldError>}
							</Field>
							<Field>
								<FieldLabel htmlFor="password">Password</FieldLabel>
								<Input
									className="h-9 px-3"
									placeholder="Enter your password"
									id="password"
									type="password"
									autoComplete="off"
									onChange={(e) => {
										setData('password', e.target.value)
										clearErrors('password')
									}}
								/>
							</Field>
							<Button type="submit" disabled={processing} variant={processing ? "secondary" : "default"} className={"h-9 rounded-lg"}>
								{processing && <Spinner />}
								Sign in
							</Button>
						</FieldGroup>
					</form>
					<p className="text-sm text-subtle">Don't have an account? <LinkUnderline href="/signup" className="text-foreground">Join for free</LinkUnderline></p>
					<p className="text-sm text-subtle">By signing in or creating an account, you agree to our <LinkUnderline href="/terms">Terms of service</LinkUnderline> and <LinkUnderline href="/privacy">Privacy policy</LinkUnderline>.</p>
				</div>
			</div>
		</>
	)
}

LoginPage.layout = (page: React.ReactNode) => <BaseLayout hideHeader={true} hideFooter={true}>{page}</BaseLayout>