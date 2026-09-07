import { LogoIcon } from "@/assets/LogoIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { AuthProps } from "@/interfaces/auth";

import BaseLayout from "@/layouts/BaseLayout"
import { useForm, usePage } from "@inertiajs/react";
import { UploadIcon } from "lucide-react";
import { useRef, useState } from "react";

interface Props {
	auth: AuthProps
}

const MAX_BIO_LENGTH = 90

export default function OnboardingPage({ auth }: Props) {
	const user = auth.user
	const { data, setData, processing, errors, patch, transform, clearErrors, cancel, resetAndClearErrors } = useForm({
		user: {
			avatar: null as File | string | null,
			bio: user?.bio
		}
	})

	const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(user?.avatar_url as string)
	const imageFileInputRef = useRef<HTMLInputElement>(null)

	const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]

		if (file && file.type.startsWith("image/")) {
			const url = URL.createObjectURL(file)

			clearErrors('user.avatar')
			setPreviewImageUrl(url)
			setData("user.avatar", file)
		}
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

		patch('/users')
	}

	return (
		<div className="max-w-lg mx-auto px-5 py-16">
			<div className="mb-10 text-center">
				<div className="mb-4 mx-auto w-fit">
					<LogoIcon />
				</div>
				<h1 className="text-xl">Welcome to Tomes</h1>
				<p className="text-subtle">Finish setting up your profile to join the club!</p>
			</div>
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
					<FieldDescription className="text-xs">Must be a PNG, JPEG, WEBP, or AVIF file smaller than 1MB. <br /> (recommended ratio 1:1).</FieldDescription>
				</Field>
				<Field>
					<div className="flex justify-between">
						<FieldLabel htmlFor="bio">Bio (optional)</FieldLabel>
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
				<Button onClick={handleSubmit} size={"lg"} disabled={processing} variant={processing ? "secondary" : "default"}>{processing && <Spinner />} Continue</Button>
			</FieldGroup>
		</div>
	)
}


OnboardingPage.layout = (page: React.ReactNode) => <BaseLayout hideHeaderForced={true} hideFooter={true}>{page}</BaseLayout>