import React, { ReactElement, useState, useEffect } from 'react'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import SearchBar from '../../molecules/SearchBar'
import AssetQueryList from '../../organisms/AssetQueryList'
import styles from './index.module.css'
import queryString from 'query-string'
import { getResults } from './utils'
import Loader from '../../atoms/Loader'
import { useOcean } from '@oceanprotocol/react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
const defaultSearchItems = () =>
  ['created', 'price.ocean', 'price.value'].map((e) => ({
    id: e,
    direction: -1
  }))

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const grid = 8

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid,
  margin: `0 ${grid}px 0 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'transparent',
  border: '1px solid grey',

  // styles we need to apply on draggables
  ...draggableStyle
})

const getListStyle = () => ({
  display: 'inline-flex',
  padding: grid,
  overflow: 'auto'
})

export default function SearchPage({
  location
}: {
  location: Location
}): ReactElement {
  const { config } = useOcean()
  const parsed = queryString.parse(location.search)
  const { text, owner, tags, page } = parsed
  const [queryResult, setQueryResult] = useState<QueryResult>()
  const [loading, setLoading] = useState<boolean>()
  const [priceType, setPriceType] = useState<string>('')
  const [items, setItems] = useState(defaultSearchItems())

  function onClick(i) {
    setItems([
      ...items.slice(0, i),
      { ...items[i], direction: -items[i].direction },
      ...items.slice(i + 1)
    ])
  }
  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const i = reorder(items, result.source.index, result.destination.index)

    setItems(i)
  }

  useEffect(() => {
    if (!config?.metadataCacheUri) return

    async function initSearch() {
      setLoading(true)
      const queryResult = await getResults(
        parsed,
        config.metadataCacheUri,
        priceType,
        items
      )
      setQueryResult(queryResult)
      setLoading(false)
    }
    initSearch()
  }, [text, owner, tags, page, config.metadataCacheUri, priceType, items])

  return (
    <section className={styles.grid}>
      <div className={styles.search}>
        {(text || owner) && (
          <SearchBar initialValue={(text || owner) as string} />
        )}
        Filtering:{' '}
        <select
          value={priceType}
          onChange={(e) => setPriceType(e.target.value)}
        >
          <option value=""></option>
          <option value="exchange">exchange</option>
          <option value="pool">pool</option>
        </select>
        <DragDropContext onDragEnd={onDragEnd}>
          <br />
          Sorting:{' '}
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle()}
                {...provided.droppableProps}
              >
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <div>
                          {item.id}
                          <button onClick={(e) => onClick(index)}>
                            {item.direction === -1 ? '\u25bc' : '\u25b2'}
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className={styles.results}>
        {loading ? <Loader /> : <AssetQueryList queryResult={queryResult} />}
      </div>
    </section>
  )
}
