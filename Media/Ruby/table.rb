# Table: an immutable, two part data structure: a schema and a rectangular collection of cells
class Table
  attr_accessor :rows

  def initialize(schema: Schema.new, rows: [])
    @rows = rows
    @schema = schema
  end

  def schema
    @schema.nil? ? [] : @schema 
  end

  def add_header(c)
    @schema = Schema.new if @schema.nil? || schema == []
    @schema.add_header(c)
  end

  def duplicate
    Table.new(schema: schema.nil? || schema == [] ? [] : schema.duplicate, rows: rows.map{ |r| r.duplicate} )
  end
end