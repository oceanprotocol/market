import React from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from 'react-beautiful-dnd'
import { SortItem, SortTermOptions, SortValueOptions } from './utils'
import Tooltip from '../../atoms/Tooltip'
import generalStyles from './index.module.css'
import styles from './sort.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)

const reorder = (list: SortItem[], startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

const defaultSearchItems = () =>
  [
    SortTermOptions.Published,
    SortTermOptions.Liquidity,
    SortTermOptions.Price
  ].map((e) => ({
    by: e,
    direction: SortValueOptions.Descending
  }))

export const initItems = (sort: string[]) =>
  sort
    ? (sort as string[]).map((e) => {
        const ee = e.split(':')
        return {
          by: ee[0],
          direction: ee[1] as SortValueOptions
        } as SortItem
      })
    : defaultSearchItems()

export default ({
  items,
  setItems
}: {
  items: SortItem[]
  setItems: React.Dispatch<React.SetStateAction<SortItem[]>>
}) => {
  function onClick(i: number) {
    setItems([
      ...items.slice(0, i),
      {
        ...items[i],
        direction:
          items[i].direction === SortValueOptions.Descending
            ? SortValueOptions.Ascending
            : SortValueOptions.Descending
      },
      ...items.slice(i + 1)
    ])
  }
  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (
      !result.destination ||
      result.source.index === result.destination.index
    ) {
      return
    }

    const itemsReordered = reorder(
      items,
      result.source.index,
      result.destination.index
    )

    setItems(itemsReordered)
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={generalStyles.column}>
        <div className={generalStyles.description}>Sort by: </div>
        <Tooltip
          content="drag&drop railwagons to rearrange sorting priority"
          placement="top"
        >
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                className={styles.sortList}
                {...provided.droppableProps}
              >
                {items.map((item: SortItem, index: number) => (
                  <Draggable key={item.by} draggableId={item.by} index={index}>
                    {(provided, snapshot) => {
                      const sortItem = cx({
                        [styles.dragging]: snapshot.isDragging,
                        [styles.sortItem]: true
                      })
                      const bufferBefore = cx({
                        [styles.dragging]: snapshot.isDragging,
                        [styles.bufferBefore]: true
                      })
                      const bufferAfter = cx({
                        [styles.dragging]: snapshot.isDragging,
                        [styles.bufferAfter]: true
                      })
                      const wheel = cx({
                        [styles.dragging]: snapshot.isDragging,
                        [styles.wheel]: true
                      })
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={provided.draggableProps.style}
                          className={styles.draggable}
                        >
                          <div className={styles.wheels}>
                            {[1, 2].map((value, index) => (
                              <div key={index} className={styles.pair}>
                                {[1, 2].map((value, index) => (
                                  <div key={index} className={wheel} />
                                ))}
                              </div>
                            ))}
                          </div>
                          <div className={bufferBefore} />
                          <div className={sortItem}>
                            <div className={styles.windows}>
                              {[1, 2, 3, 4].map((value, index) => (
                                <div key={index} className={styles.window} />
                              ))}
                            </div>
                            <div className={styles.payload}>
                              {index + 1} - {item.by}
                              <Tooltip
                                content="click to change direction"
                                placement="bottom"
                              >
                                <button
                                  onClick={(e) => onClick(index)}
                                  className={styles.direction}
                                >
                                  {item.direction ===
                                  SortValueOptions.Descending
                                    ? '\u25bc'
                                    : '\u25b2'}
                                </button>
                              </Tooltip>
                            </div>
                          </div>
                          <div className={bufferAfter} />
                        </div>
                      )
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Tooltip>
      </div>
    </DragDropContext>
  )
}
