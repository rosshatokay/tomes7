import { Button } from "@/components/ui/button";
import { goBack, useIsMobile } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import { PropsWithChildren } from "react";
import { Fragment } from "react/jsx-runtime";

export default function BackBtnHeader({ children }: { children?: React.ReactNode }) {
	const isMobile = useIsMobile()

	return (
		<Fragment>
			{isMobile && (
				<Fragment>
					<header className="fixed top-0 left-0 md:h-16 h-14 w-full z-4 bg-background flex items-center">
						<div className="flex items-center large-container justify-between">
							<Button onClick={goBack} size={"icon-lg"} variant={"ghost"}><ArrowLeftIcon /></Button>
							<div className="flex gap-1">
								{children}
							</div>
						</div>
					</header>
					<div className="md:h-16 h-14"></div>
				</Fragment>
			)}
		</Fragment>
	)
}