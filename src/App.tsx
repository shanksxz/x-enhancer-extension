import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { TWITTER_BUTTONS } from "./utils";

export default function App() {
    const [settings, setSettings] = useState<Settings>({
        isEnabled: false,
        hiddenButtons: [],
    });

    useEffect(() => {
        chrome.storage.sync.get(["isEnabled", "hiddenButtons"], (result) => {
            setSettings({
                isEnabled: result.isEnabled || false,
                hiddenButtons: result.hiddenButtons || [],
            });
        });
    }, []);

    useEffect(() => {
        chrome.storage.sync.set(settings);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentTab = tabs[0];
            if (
                currentTab?.id &&
                (currentTab.url?.includes("x.com") || currentTab.url?.includes("twitter.com"))
            ) {
                chrome.tabs.sendMessage(currentTab.id, {
                    type: "TOGGLE_BUTTONS",
                    ...settings,
                });
            }
        });
    }, [settings]);

    const handleToggle = (checked: boolean) => {
        setSettings((prev) => ({ ...prev, isEnabled: checked }));
    };

    const handleCheckboxChange = (buttonId: string, checked: boolean) => {
        setSettings((prev) => ({
            ...prev,
            hiddenButtons: checked
                ? [...prev.hiddenButtons, buttonId]
                : prev.hiddenButtons.filter((id) => id !== buttonId),
        }));
    };

    const handleSelectAll = (checked: boolean) => {
        setSettings((prev) => ({
            ...prev,
            hiddenButtons: checked ? TWITTER_BUTTONS.map((button) => button.id) : [],
        }));
    };

    const allSelected =
        settings.hiddenButtons.length === TWITTER_BUTTONS.length &&
        TWITTER_BUTTONS.every((button) => settings.hiddenButtons.includes(button.id));

    return (
        <Card className="w-[280px] shadow-none rounded-lg">
            <CardHeader className="pb-3 space-y-1.5">
                <CardTitle className="text-base font-semibold">Twitter Button Hider</CardTitle>
                <CardDescription className="text-xs">
                    Hide unwanted buttons from Twitter sidebars
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
                <div className="flex items-center space-x-2">
                    <Switch
                        id="extension-toggle"
                        checked={settings.isEnabled}
                        onCheckedChange={handleToggle}
                    />
                    <Label htmlFor="extension-toggle" className="text-sm font-normal">
                        Enable extension
                    </Label>
                </div>
                <Separator className="my-4" />
                <ScrollArea className="h-[280px] pr-4">
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="select-all"
                                checked={allSelected}
                                onCheckedChange={handleSelectAll}
                                disabled={!settings.isEnabled}
                            />
                            <Label
                                htmlFor="select-all"
                                className="text-sm font-medium text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Select All
                            </Label>
                        </div>
                        {TWITTER_BUTTONS.map((button) => (
                            <div key={button.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={button.id}
                                    checked={settings.hiddenButtons.includes(button.id)}
                                    onCheckedChange={(checked) =>
                                        handleCheckboxChange(button.id, checked as boolean)
                                    }
                                    disabled={!settings.isEnabled}
                                />
                                <Label
                                    htmlFor={button.id}
                                    className="text-sm font-normal text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {button.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
