import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { AuthProps } from "@/interfaces/auth";
import Modal from "@/interfaces/modals";
import { ThemeOptions } from "@/interfaces/theme";
import { useForm } from "@inertiajs/react";
import { UploadIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props extends Modal {
	user: AuthProps['user']
}

const themeOptions = [
	{ label: "System", value: "system" },
	{ label: "Light", value: "light" },
	{ label: "Dark", value: "dark" },
]

const MAX_BIO_LENGTH = 90

export default function UserSettingsDialog({ isOpen, setIsOpen, user }: Props) {
	const [currTheme, setCurrTheme] = useState<ThemeOptions>()
	const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(user?.avatar_url as string)
	const imageFileInputRef = useRef<HTMLInputElement>(null)

	const { data, setData, processing, errors, patch, transform, clearErrors, cancel, resetAndClearErrors } = useForm({
		user: {
			avatar: null as File | string | null,
			bio: user?.bio
		}
	})


	const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]

		if (file && file.type.startsWith("image/")) {
			const url = URL.createObjectURL(file)
			
			clearErrors('user.avatar')
			setPreviewImageUrl(url)
			setData("user.avatar", file)
		}
	}

	const handleThemeChange = (theme: string | null) => {
		window.Theme.setTheme(theme as ThemeOptions)
		setCurrTheme(window.Theme.getTheme())
		toast.add({ description: "Appearance changed successfully" })
	}

	const handleSubmit = () => {
		transform((latestData) => {
			const payload: Record<string, any> = { ...latestData.user }

			// if not new file, don't send it as raw file
			if (!(payload.avatar instanceof File)) {
				delete payload.avatar
			}
			
			return { user: payload }
		})

		patch('/users', {
			onSuccess: () => setIsOpen(false)
		})
	}

	useEffect(() => {
		setCurrTheme(window.Theme.getTheme())
	}, [currTheme])

	return (
		<Dialog open={isOpen} onOpenChange={open => !open && setIsOpen(false)}>
			<DialogContent className={"md:!max-w-xl max-h-[90vh] flex flex-col"}>
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
				</DialogHeader>
				<div className="overflow-y-auto -m-4 p-4">
					<FieldGroup>
						<Field>
							<FieldLabel>Profile picture</FieldLabel>
							<div className="flex items-center gap-4 mt-1 mb-2">
								<Avatar className={"size-15"}>
									<AvatarImage src={previewImageUrl || ""} />
									<AvatarFallback>{user?.username[0]}</AvatarFallback>
								</Avatar>
								<Input ref={imageFileInputRef} onChange={handleImageFileChange} type="file" accept="image/*" className="hidden" />
								<div>
									<Button
										onClick={() => imageFileInputRef.current?.click()}
										type="button"
										variant={"outline"}><UploadIcon /> Upload an image</Button>
									{errors['user.avatar'] && <FieldError className="mt-1">{errors["user.avatar"]}</FieldError>}
								</div>
							</div>
							<FieldDescription className="text-xs">Must be a PNG, JPEG, WEBP, or AVIF file smaller than 1MB (recommended ratio 1:1).</FieldDescription>
						</Field>
						<Field>
							<FieldLabel htmlFor="username">Username</FieldLabel>
							<Input id="username" readOnly value={user?.username} disabled />
							<FieldDescription className="text-xs">Currently not available to change.</FieldDescription>
						</Field>
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input id="email" type="email" readOnly value={user?.email} disabled />
							<FieldDescription className="text-xs">Currently not available to change.</FieldDescription>
						</Field>
						<Field>
							<div className="flex justify-between">
								<FieldLabel htmlFor="bio">Bio</FieldLabel>
								<div className="text-xs text-subtle">{data.user.bio?.length || 0} / {MAX_BIO_LENGTH}</div>
							</div>
							<Textarea
								id="bio"
								placeholder="Enter a short bio about yourself..."
								maxLength={MAX_BIO_LENGTH}
								onChange={(e) => {
									clearErrors('user.bio')
									setData('user.bio', e.target.value)
								}}
								value={data.user.bio}
							/>
							{errors['user.bio'] && <FieldError>{errors['user.bio']}</FieldError>}
						</Field>
						<Field>
							<FieldLabel>Appearance</FieldLabel>
							<Select items={themeOptions} defaultValue={currTheme} onValueChange={handleThemeChange}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Theme</SelectLabel>
										{themeOptions.map(item => (
											<SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</Field>
					</FieldGroup>
				</div>
				<DialogFooter>
					<Button variant={"secondary"} onClick={() => {
						cancel()
						resetAndClearErrors()
						setPreviewImageUrl(user?.avatar_url || "")
						setIsOpen(false)
					}}>Cancel</Button>
					<Button onClick={handleSubmit} disabled={processing} variant={processing ? "secondary" : "default"}>
						{processing && <Spinner />}
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}