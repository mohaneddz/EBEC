import { Button } from "@/components/ui/button";

interface Props {
    title: string;
    description: string;
}

export default function FormCard(props: Props) {
    return (
        <div className="h-full w-full bg-gray-100 text-white rounded-md center p-4 flex flex-col shadow ">
            <h1 className="text-lg font-bold text-primary-light">{props.title}</h1>
            <p className="text-sm font-light my-2 text-black">{props.description}</p>

            <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                <Button className="mt-auto text-white w-full" variant="destructive">
                    Remove
                </Button>
                <a href="/dashboard/tools/form_editor">
                    <Button className="mt-auto text-white w-full" variant="secondary">
                        Manage
                    </Button>
                </a>
            </div>

        </div>
    );
};
