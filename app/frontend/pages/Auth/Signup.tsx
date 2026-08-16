import { LogoIcon } from "@/assets/LogoIcon"
import { GoogleIcon } from "@/assets/socials/GoogleIcon"
import { LinkUnderline } from "@/components/partials/LinkUnderline"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import BaseLayout from "@/layouts/BaseLayout"

export default function SignupPage() {
	const handleSubmit = () => {

	}

	return (
		<>
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
								<FieldLabel>Email</FieldLabel>
								<Input
									id="email"
									className="h-9 px-3"
									placeholder="Enter your email"
								/>
							</Field>
							<Field>
								<FieldLabel>Username</FieldLabel>
								<Input
									id="email"
									className="h-9 px-3"
									placeholder="Enter a username"
								/>
							</Field>
							<Field>
								<FieldLabel>Password</FieldLabel>
								<Input
									id="email"
									className="h-9 px-3"
									placeholder="Enter a password"
								/>
							</Field>
							<Button className={"h-9 rounded-lg"}>Create a free account</Button>
						</FieldGroup>
					</form>
					<p className="text-sm text-subtle">Already have an account? <LinkUnderline href="/login" className="text-foreground">Sign in</LinkUnderline></p>
					<p className="text-sm text-subtle">By signing in or creating an account, you agree to our <LinkUnderline href="/terms">Terms of service</LinkUnderline> and <LinkUnderline href="/privacy">Privacy policy</LinkUnderline>.</p>
				</div>
			</div>
		</>
	)
}

SignupPage.layout = (page: React.ReactNode) => <BaseLayout hideHeader={true} hideFooter={true}>{page}</BaseLayout>
