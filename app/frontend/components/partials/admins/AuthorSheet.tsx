import { useForm, useHttp } from "@inertiajs/react";
import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetContent, SheetFooter, SheetClose } from "../../ui/sheet";
import { useEffect, useRef, useState } from "react";
import { Field, FieldError, FieldGroup, FieldLabel } from "../../ui/field";
import { Input } from "../../ui/input";
import { Spinner } from "../../ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";

const INITIAL_AUTHOR_STATE = {
  id: null as string | null,
  full_name: "",
  bio: "",
  wiki_url: "",
  avatar: null as File | string | null
}

interface Props {
  // Pass 'new' to create, an ID string to edit, or null to close
  activeAuthorId: string | "new" | null;
  setActiveAuthorId: (id: string | "new" | null) => void;
}

export default function AuthorSheet({ activeAuthorId, setActiveAuthorId }: Props) {
  const http = useHttp({ id: "" });
  const { data, setData, processing, patch, post, transform, reset, errors, clearErrors } = useForm({
    author: INITIAL_AUTHOR_STATE
  });

  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const isEditing = activeAuthorId !== null && activeAuthorId !== "new";
  const isOpen = activeAuthorId !== null;

  const handleUploadImageBtnClick = () => {
    imageFileInputRef.current?.click();
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewImageUrl(url);
      setData("author.avatar", file);
    }
  };

  const handleClose = () => {
    setActiveAuthorId(null);
    reset();
    setPreviewImageUrl(null);
  };

  const handleSubmit = () => {
    transform((latestData) => {
      const payload: Record<string, any> = { ...latestData.author };

      // Omit avatar if it's not a new File upload
      if (!(payload.avatar instanceof File)) {
        delete payload.avatar;
      }

      return { author: payload };
    });

    const options: any = {
      onSuccess: () => handleClose(),
      onError: (errors: Record<string, string>) => console.error(errors)
    };

    if (isEditing) {
      patch(`/admins/authors/${data.author.id}`, options);
    } else {
      post("/admins/authors", options);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    if (isEditing) {
      // Fetch author details for editing
      http.setData("id", activeAuthorId);
      http.get("/api/v1/admins/authors", {
        onSuccess: (res: any) => {
          setData("author", {
            id: res.author.id,
            full_name: res.author.full_name ?? "",
            bio: res.author.bio ?? "",
            wiki_url: res.author.wiki_url ?? "",
            avatar: null
          });
          setPreviewImageUrl(res.author.avatar_url ?? null);
        }
      });
    } else {
      // Reset form fields for creation mode
      reset();
      setPreviewImageUrl(null);
    }
  }, [activeAuthorId]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit author" : "Create author"}</SheetTitle>
          <SheetDescription>
            {isEditing ? "Make changes to the author details." : "Add a new author to the database."}
          </SheetDescription>
        </SheetHeader>

        {http.processing && (
          <div className="flex-center pt-6">
            <Spinner className="size-6" />
          </div>
        )}

        {!http.processing && (
          <FieldGroup className="grid auto-rows-min px-4 flex-1 overflow-y-auto">
            <Field orientation={"horizontal"}>
              <Avatar className={"w-16 h-16 aspect-square mr-2"}>
                <AvatarImage src={previewImageUrl || ""} />
                <AvatarFallback>{data.author.full_name?.[0] || "?"}</AvatarFallback>
              </Avatar>
              <Input
                ref={imageFileInputRef}
                onChange={handleImageFileChange}
                type="file"
                accept="image/*"
                className="hidden"
              />
              <Button onClick={handleUploadImageBtnClick} variant={"secondary"}>
                Upload image
              </Button>
            </Field>

            <Field>
              <FieldLabel htmlFor="full_name">Full name</FieldLabel>
              <Input
                id="full_name"
                placeholder="Enter the author's full name"
                value={data.author.full_name}
								aria-invalid={!!errors["author.full_name"]}
                onChange={(e) => {
									setData("author.full_name", e.target.value)
									clearErrors("author.full_name")
								}}
              />
							{errors["author.full_name"] && <FieldError>{errors["author.full_name"]}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Bio</FieldLabel>
              <Textarea
                placeholder="Enter the author's bio"
                value={data.author.bio}
                className="bg-input"
                onChange={(e) => setData("author.bio", e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="wiki_url">Wiki URL</FieldLabel>
              <Input
                id="wiki_url"
                placeholder="Enter the Wikipedia page URL"
                value={data.author.wiki_url}
                className="bg-input"
                onChange={(e) => setData("author.wiki_url", e.target.value)}
              />
            </Field>
          </FieldGroup>
        )}

        {!http.processing && (
          <SheetFooter className="pt-0">
            <Button disabled={processing} variant={processing ? "secondary" : "default"} onClick={handleSubmit}>
              {processing && <Spinner />}
              <span>{isEditing ? "Save changes" : "Create author"}</span>
            </Button>
            <SheetClose render={<Button variant={"secondary"} onClick={handleClose} />}>
              Close
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}