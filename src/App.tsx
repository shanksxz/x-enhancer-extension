import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import { RIGHT_SIDEBAR_ELEMENTS, TWITTER_BUTTONS } from "./utils";

export default function App() {
    const [settings, setSettings] = useState<Settings>({
        isEnabled: false,
        hiddenButtons: [],
        hiddenRightElements: [],
        removeGrokSuggestions: false,
    });

    useEffect(() => {
        browser.storage.sync
            .get(["isEnabled", "hiddenButtons", "hiddenRightElements", "removeGrokSuggestions"])
            .then((result: Partial<Settings>) => {
                console.log("Loaded settings:", result);
                setSettings({
                    isEnabled: result.isEnabled ?? false,
                    hiddenButtons: result.hiddenButtons ?? [],
                    hiddenRightElements: result.hiddenRightElements ?? [],
                    removeGrokSuggestions: result.removeGrokSuggestions ?? false,
                });
            })
            .catch((error) => {
                console.error("Error loading settings:", error);
            });
    }, []);

    useEffect(() => {
        console.log("Saving settings:", settings);
        browser.storage.sync
            .set({ ...settings })
            .then(() => {
                console.log("Settings saved successfully");
            })
            .catch((error) => {
                console.error("Error saving settings:", error);
            });

        browser.tabs
            .query({ active: true, currentWindow: true })
            .then((tabs) => {
                const currentTab = tabs[0];
                if (
                    currentTab?.id &&
                    (currentTab.url?.includes("x.com") || currentTab.url?.includes("twitter.com"))
                ) {
                    return browser.tabs.sendMessage(currentTab.id, {
                        type: "TOGGLE_ELEMENTS",
                        ...settings,
                    });
                }
            })
            .then(() => {
                console.log("Message sent to content script");
            })
            .catch((error) => {
                console.error("Error sending message to content script:", error);
            });
    }, [settings]);

    const handleToggle = (checked: boolean) => {
        setSettings((prev) => ({ ...prev, isEnabled: checked }));
    };

    // const handleGrokToggle = (checked: boolean) => {
    //     setSettings((prev) => ({ ...prev, removeGrokSuggestions: checked }));
    // };

    const handleCheckboxChange = (buttonId: string, checked: boolean) => {
        setSettings((prev) => ({
            ...prev,
            hiddenButtons: checked
                ? [...prev.hiddenButtons, buttonId]
                : prev.hiddenButtons.filter((id) => id !== buttonId),
        }));
    };

    const handleRightElementChange = (elementId: string, checked: boolean) => {
        setSettings((prev) => ({
            ...prev,
            hiddenRightElements: checked
                ? [...prev.hiddenRightElements, elementId]
                : prev.hiddenRightElements.filter((id) => id !== elementId),
        }));
    };

    const handleSelectAll = (checked: boolean) => {
        setSettings((prev) => ({
            ...prev,
            hiddenButtons: checked ? TWITTER_BUTTONS.map((button) => button.id) : [],
        }));
    };

    const handleSelectAllRight = (checked: boolean) => {
        setSettings((prev) => ({
            ...prev,
            hiddenRightElements: checked ? RIGHT_SIDEBAR_ELEMENTS.map((element) => element.id) : [],
        }));
    };

    const allSelected =
        settings.hiddenButtons.length === TWITTER_BUTTONS.length &&
        TWITTER_BUTTONS.every((button) => settings.hiddenButtons.includes(button.id));

    const allRightSelected =
        settings.hiddenRightElements.length === RIGHT_SIDEBAR_ELEMENTS.length &&
        RIGHT_SIDEBAR_ELEMENTS.every((element) =>
            settings.hiddenRightElements.includes(element.id),
        );

    return (
        <Card className="w-[340px] shadow-none rounded-lg">
            <CardHeader className="pb-3 space-y-1.5">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-semibold">X/Twitter Enhancer</CardTitle>
                </div>
                <CardDescription className="text-xs">
                    Customize your X/Twitter experience
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
                <div className="flex items-center justify-between mb-4">
                    <Label htmlFor="extension-toggle" className="text-sm font-medium">
                        Enable extension
                    </Label>
                    <Switch
                        id="extension-toggle"
                        checked={settings.isEnabled}
                        onCheckedChange={handleToggle}
                    />
                </div>

                {/* //TODO: Implement logic to remove grok ai svg's */}
                {/* <div className="flex items-center justify-between mb-4">
                    <Label htmlFor="grok-toggle" className="text-sm font-medium">
                        Remove Grok suggestions
                    </Label>
                    <Switch
                        aria-disabled={true}
                        id="grok-toggle"
                        checked={settings.removeGrokSuggestions}
                        onCheckedChange={handleGrokToggle}
                        disabled={!settings.isEnabled}
                    />
                </div> */}

                <Separator className="my-4" />

                <Tabs defaultValue="left" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="left">Left Sidebar</TabsTrigger>
                        <TabsTrigger value="right">Right Sidebar</TabsTrigger>
                    </TabsList>

                    <TabsContent value="left" className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-medium">Hide buttons</Label>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="select-all"
                                    checked={allSelected}
                                    onCheckedChange={handleSelectAll}
                                    disabled={!settings.isEnabled}
                                />
                                <Label
                                    htmlFor="select-all"
                                    className="text-xs font-medium text-muted-foreground"
                                >
                                    Select All
                                </Label>
                            </div>
                        </div>
                        <ScrollArea className="h-[200px] rounded-md border p-2">
                            <div className="space-y-2">
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
                    </TabsContent>

                    <TabsContent value="right" className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-medium">Hide elements</Label>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="select-all-right"
                                    checked={allRightSelected}
                                    onCheckedChange={handleSelectAllRight}
                                    disabled={!settings.isEnabled}
                                />
                                <Label
                                    htmlFor="select-all-right"
                                    className="text-xs font-medium text-muted-foreground"
                                >
                                    Select All
                                </Label>
                            </div>
                        </div>
                        <ScrollArea className="h-[200px] rounded-md border p-2">
                            <div className="space-y-4">
                                {Object.entries(
                                    RIGHT_SIDEBAR_ELEMENTS.reduce(
                                        (acc, curr) => {
                                            if (!acc[curr.category]) {
                                                acc[curr.category] = [];
                                            }
                                            acc[curr.category].push(curr);
                                            return acc;
                                        },
                                        {} as Record<string, typeof RIGHT_SIDEBAR_ELEMENTS>,
                                    ),
                                ).map(([category, elements]) => (
                                    <div key={category} className="space-y-2">
                                        <Label className="text-xs font-semibold text-muted-foreground">
                                            {category}
                                        </Label>
                                        {elements.map((element) => (
                                            <div
                                                key={element.id}
                                                className="flex items-center space-x-2 ml-2"
                                            >
                                                <Checkbox
                                                    id={`right-${element.id}`}
                                                    checked={settings.hiddenRightElements.includes(
                                                        element.id,
                                                    )}
                                                    onCheckedChange={(checked) =>
                                                        handleRightElementChange(
                                                            element.id,
                                                            checked as boolean,
                                                        )
                                                    }
                                                    disabled={!settings.isEnabled}
                                                />
                                                <Label
                                                    htmlFor={`right-${element.id}`}
                                                    className="text-sm font-normal text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {element.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
