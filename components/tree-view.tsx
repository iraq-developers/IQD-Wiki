'use client'

import React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronRight } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const treeVariants = cva(
    "group hover:before:opacity-100 before:absolute before:rounded-lg before:start-0 px-2 before:w-full before:opacity-0 before:bg-accent/70 before:h-[2rem] before:-z-10"
)

const selectedTreeVariants = cva(
    "before:opacity-100 before:bg-accent/70 text-accent-foreground"
)

const dragOverVariants = cva(
    "before:opacity-100 before:bg-primary/20 text-primary-foreground"
)

interface TreeDataItem {
    id: string
    name: string
    icon?: React.ComponentType<{ className?: string }>
    selectedIcon?: React.ComponentType<{ className?: string }>
    openIcon?: React.ComponentType<{ className?: string }>
    children?: TreeDataItem[]
    actions?: React.ReactNode
    onClick?: () => void
    draggable?: boolean
    droppable?: boolean
    disabled?: boolean
    className?: string
}

type TreeRenderItemParams = {
    item: TreeDataItem
    level: number
    isLeaf: boolean
    isSelected: boolean
    isOpen?: boolean
    hasChildren: boolean
}

type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
    data: TreeDataItem[] | TreeDataItem
    initialSelectedItemId?: string
    /** Pass to make selection controlled — keeps the tree in sync with
     *  selections made outside it (list views, deletions, deep links). */
    selectedItemId?: string
    onSelectChange?: (item: TreeDataItem | undefined) => void
    expandAll?: boolean
    defaultNodeIcon?: React.ComponentType<{ className?: string }>
    defaultLeafIcon?: React.ComponentType<{ className?: string }>
    onDocumentDrag?: (sourceItem: TreeDataItem, targetItem: TreeDataItem) => void
    renderItem?: (params: TreeRenderItemParams) => React.ReactNode
}

const TreeView = React.forwardRef<HTMLDivElement, TreeProps>(
    (
        {
            data,
            initialSelectedItemId,
            selectedItemId: controlledSelectedItemId,
            onSelectChange,
            expandAll,
            defaultLeafIcon,
            defaultNodeIcon,
            className,
            onDocumentDrag,
            renderItem,
            ...props
        },
        ref
    ) => {
        const [uncontrolledSelectedItemId, setUncontrolledSelectedItemId] = React.useState<
            string | undefined
        >(initialSelectedItemId)

        // When `selectedItemId` is supplied the tree is fully controlled, so
        // selecting an item elsewhere in the UI keeps the highlight in sync.
        const isControlled = controlledSelectedItemId !== undefined
        const selectedItemId = isControlled
            ? controlledSelectedItemId
            : uncontrolledSelectedItemId

        const [draggedItem, setDraggedItem] = React.useState<TreeDataItem | null>(null)

        const handleSelectChange = React.useCallback(
            (item: TreeDataItem | undefined) => {
                setUncontrolledSelectedItemId(item?.id)
                if (onSelectChange) {
                    onSelectChange(item)
                }
            },
            [onSelectChange]
        )

        const handleDragStart = React.useCallback((item: TreeDataItem) => {
            setDraggedItem(item)
        }, [])

        const handleDrop = React.useCallback((targetItem: TreeDataItem) => {
            if (draggedItem && onDocumentDrag && draggedItem.id !== targetItem.id) {
                onDocumentDrag(draggedItem, targetItem)
            }
            setDraggedItem(null)
        }, [draggedItem, onDocumentDrag])

        const expandedItemIds = React.useMemo(() => {
            if (!initialSelectedItemId) {
                return [] as string[]
            }

            const ids: string[] = []

            function walkTreeItems(
                items: TreeDataItem[] | TreeDataItem,
                targetId: string
            ) {
                if (Array.isArray(items)) {
                    for (let i = 0; i < items.length; i++) {
                        ids.push(items[i].id)
                        if (walkTreeItems(items[i], targetId) && !expandAll) {
                            return true
                        }
                        if (!expandAll) ids.pop()
                    }
                } else if (!expandAll && items.id === targetId) {
                    return true
                } else if (items.children) {
                    return walkTreeItems(items.children, targetId)
                }
            }

            walkTreeItems(data, initialSelectedItemId)
            return ids
        }, [data, expandAll, initialSelectedItemId])

        return (
            <div className={cn("overflow-hidden relative p-2", className)}>
                <TreeItem
                    data={data}
                    ref={ref}
                    selectedItemId={selectedItemId}
                    handleSelectChange={handleSelectChange}
                    expandedItemIds={expandedItemIds}
                    defaultLeafIcon={defaultLeafIcon}
                    defaultNodeIcon={defaultNodeIcon}
                    handleDragStart={handleDragStart}
                    handleDrop={handleDrop}
                    draggedItem={draggedItem}
                    renderItem={renderItem}
                    level={0}
                    {...props}
                />
                <div
                    className="w-full h-[48px]"
                    onDrop={() => { handleDrop({id: '', name: 'parent_div'})}}>
                </div>
            </div>
        )
    }
)
TreeView.displayName = 'TreeView'

type TreeItemProps = TreeProps & {
    selectedItemId?: string
    handleSelectChange: (item: TreeDataItem | undefined) => void
    expandedItemIds: string[]
    defaultNodeIcon?: React.ComponentType<{ className?: string }>
    defaultLeafIcon?: React.ComponentType<{ className?: string }>
    handleDragStart?: (item: TreeDataItem) => void
    handleDrop?: (item: TreeDataItem) => void
    draggedItem: TreeDataItem | null
    level?: number
}

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
    (
        {
            className,
            data,
            selectedItemId,
            handleSelectChange,
            expandedItemIds,
            defaultNodeIcon,
            defaultLeafIcon,
            handleDragStart,
            handleDrop,
            draggedItem,
            renderItem,
            level,
            onSelectChange,
            expandAll,
            initialSelectedItemId,
            onDocumentDrag,
            ...props
        },
        ref
    ) => {
        if (!(Array.isArray(data))) {
            data = [data]
        }
        return (
            <div ref={ref} role="tree" className={className} {...props}>
                <ul>
                    {data.map((item) => (
                        <li key={item.id}>
                            {item.children ? (
                                <TreeNode
                                    item={item}
                                    level={level ?? 0}
                                    selectedItemId={selectedItemId}
                                    expandedItemIds={expandedItemIds}
                                    handleSelectChange={handleSelectChange}
                                    defaultNodeIcon={defaultNodeIcon}
                                    defaultLeafIcon={defaultLeafIcon}
                                    handleDragStart={handleDragStart}
                                    handleDrop={handleDrop}
                                    draggedItem={draggedItem}
                                    renderItem={renderItem}
                                />
                            ) : (
                                <TreeLeaf
                                    item={item}
                                    level={level ?? 0}
                                    selectedItemId={selectedItemId}
                                    handleSelectChange={handleSelectChange}
                                    defaultLeafIcon={defaultLeafIcon}
                                    handleDragStart={handleDragStart}
                                    handleDrop={handleDrop}
                                    draggedItem={draggedItem}
                                    renderItem={renderItem}
                                />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
)
TreeItem.displayName = 'TreeItem'

const TreeNode = ({
    item,
    handleSelectChange,
    expandedItemIds,
    selectedItemId,
    defaultNodeIcon,
    defaultLeafIcon,
    handleDragStart,
    handleDrop,
    draggedItem,
    renderItem,
    level = 0,
}: {
    item: TreeDataItem
    handleSelectChange: (item: TreeDataItem | undefined) => void
    expandedItemIds: string[]
    selectedItemId?: string
    defaultNodeIcon?: React.ComponentType<{ className?: string }>
    defaultLeafIcon?: React.ComponentType<{ className?: string }>
    handleDragStart?: (item: TreeDataItem) => void
    handleDrop?: (item: TreeDataItem) => void
    draggedItem: TreeDataItem | null
    renderItem?: (params: TreeRenderItemParams) => React.ReactNode
    level?: number
}) => {
    const [value, setValue] = React.useState(
        expandedItemIds.includes(item.id) ? [item.id] : []
    )
    const [isDragOver, setIsDragOver] = React.useState(false)
    const hasChildren = !!item.children?.length
    const isSelected = selectedItemId === item.id
    const isOpen = value.includes(item.id)

    // Expand automatically when one of this node's children gets selected
    // from outside the tree (e.g. a list view or a deletion fallback).
    React.useEffect(() => {
        if (!selectedItemId || isOpen) return
        if (item.children?.some((child) => child.id === selectedItemId)) {
            setValue([item.id])
        }
    }, [selectedItemId, isOpen, item.id, item.children])

    const onDragStart = (e: React.DragEvent) => {
        if (!item.draggable) {
            e.preventDefault()
            return
        }
        e.dataTransfer.setData('text/plain', item.id)
        handleDragStart?.(item)
    }

    const onDragOver = (e: React.DragEvent) => {
        if (item.droppable !== false && draggedItem && draggedItem.id !== item.id) {
            e.preventDefault()
            setIsDragOver(true)
        }
    }

    const onDragLeave = () => {
        setIsDragOver(false)
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        handleDrop?.(item)
    }

    return (
        <AccordionPrimitive.Root
            type="multiple"
            value={value}
            onValueChange={(s) => setValue(s)}
        >
            <AccordionPrimitive.Item value={item.id}>
                <AccordionTrigger
                    className={cn(
                        treeVariants(),
                        isSelected && selectedTreeVariants(),
                        isDragOver && dragOverVariants(),
                        item.className
                    )}
                    onClick={() => {
                        handleSelectChange(item)
                        item.onClick?.()
                    }}
                    draggable={!!item.draggable}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                >
                    {renderItem ? (
                        renderItem({
                            item,
                            level,
                            isLeaf: false,
                            isSelected,
                            isOpen,
                            hasChildren,
                        })
                    ) : (
                        <>
                            <TreeIcon
                                item={item}
                                isSelected={isSelected}
                                isOpen={isOpen}
                                default={defaultNodeIcon}
                            />
                            <span className="min-w-0 flex-1 text-sm truncate">{item.name}</span>
                            <TreeActions isSelected={isSelected}>
                                {item.actions}
                            </TreeActions>
                        </>
                    )}
                </AccordionTrigger>
                <AccordionContent className="ms-4 ps-1 border-s">
                    <TreeItem
                        data={item.children ? item.children : item}
                        selectedItemId={selectedItemId}
                        handleSelectChange={handleSelectChange}
                        expandedItemIds={expandedItemIds}
                        defaultLeafIcon={defaultLeafIcon}
                        defaultNodeIcon={defaultNodeIcon}
                        handleDragStart={handleDragStart}
                        handleDrop={handleDrop}
                        draggedItem={draggedItem}
                        renderItem={renderItem}
                        level={level + 1}
                    />
                </AccordionContent>
            </AccordionPrimitive.Item>
        </AccordionPrimitive.Root>
    )
}

const TreeLeaf = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        item: TreeDataItem
        level: number
        selectedItemId?: string
        handleSelectChange: (item: TreeDataItem | undefined) => void
        defaultLeafIcon?: React.ComponentType<{ className?: string }>
        handleDragStart?: (item: TreeDataItem) => void
        handleDrop?: (item: TreeDataItem) => void
        draggedItem: TreeDataItem | null
        renderItem?: (params: TreeRenderItemParams) => React.ReactNode
    }
>(
    (
        {
            className,
            item,
            level,
            selectedItemId,
            handleSelectChange,
            defaultLeafIcon,
            handleDragStart,
            handleDrop,
            draggedItem,
            renderItem,
            ...props
        },
        ref
    ) => {
        const [isDragOver, setIsDragOver] = React.useState(false)
        const isSelected = selectedItemId === item.id

        const onDragStart = (e: React.DragEvent) => {
            if (!item.draggable || item.disabled) {
                e.preventDefault()
                return
            }
            e.dataTransfer.setData('text/plain', item.id)
            handleDragStart?.(item)
        }

        const onDragOver = (e: React.DragEvent) => {
            if (item.droppable !== false && !item.disabled && draggedItem && draggedItem.id !== item.id) {
                e.preventDefault()
                setIsDragOver(true)
            }
        }

        const onDragLeave = () => {
            setIsDragOver(false)
        }

        const onDrop = (e: React.DragEvent) => {
            if (item.disabled) return
            e.preventDefault()
            setIsDragOver(false)
            handleDrop?.(item)
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "ms-5 flex text-start items-center py-2 cursor-pointer before:end-1",
                    treeVariants(),
                    className,
                    isSelected && selectedTreeVariants(),
                    isDragOver && dragOverVariants(),
                    item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
                    item.className
                )}
                onClick={() => {
                    if (item.disabled) return
                    handleSelectChange(item)
                    item.onClick?.()
                }}
                draggable={!!item.draggable && !item.disabled}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                {...props}
            >
                {renderItem ? (
                    <>
                        <div className="h-4 w-4 shrink-0 me-1" />
                        {renderItem({
                            item,
                            level,
                            isLeaf: true,
                            isSelected,
                            hasChildren: false,
                        })}
                    </>
                ) : (
                    <>
                        <TreeIcon
                            item={item}
                            isSelected={isSelected}
                            default={defaultLeafIcon}
                        />
                        <span className="min-w-0 flex-grow text-sm truncate">{item.name}</span>
                        <TreeActions isSelected={isSelected && !item.disabled}>
                            {item.actions}
                        </TreeActions>
                    </>
                )}
            </div>
        )
    }
)
TreeLeaf.displayName = 'TreeLeaf'

const AccordionTrigger = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger
            ref={ref}
            className={cn(
                "flex flex-1 w-full items-center py-2 transition-all first:[&[data-state=open]>svg]:first-of-type:rotate-90",
                className
            )}
            {...props}
        >
            <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 text-accent-foreground/50 me-1" />
            {children}
        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className={cn(
            "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
            className
        )}
        {...props}
    >
        <div className="pb-1 pt-0">{children}</div>
    </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

const TreeIcon = ({
    item,
    isOpen,
    isSelected,
    default: defaultIcon
}: {
    item: TreeDataItem
    isOpen?: boolean
    isSelected?: boolean
    default?: React.ComponentType<{ className?: string }>
}) => {
    let Icon: React.ComponentType<{ className?: string }> | undefined = defaultIcon
    if (isSelected && item.selectedIcon) {
        Icon = item.selectedIcon
    } else if (isOpen && item.openIcon) {
        Icon = item.openIcon
    } else if (item.icon) {
        Icon = item.icon
    }
    return Icon ? (
        <Icon className="h-4 w-4 shrink-0 me-2" />
    ) : (
        <></>
    )
}

const TreeActions = ({
    children,
    isSelected
}: {
    children: React.ReactNode
    isSelected: boolean
}) => {
    return (
        <div
            className={cn(
                isSelected ? "block" : "hidden",
                "absolute end-3 group-hover:block"
            )}
        >
            {children}
        </div>
    )
}

export { 
    TreeView, 
    type TreeDataItem, 
    type TreeRenderItemParams,
    AccordionTrigger,
    AccordionContent,
    TreeLeaf,
    TreeNode,
    TreeItem
}
