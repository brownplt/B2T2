require './basics'
require './table_api'

# Table: an immutable, two part data structure: a schema and a rectangular collection of cells
class Table
  include Basics

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

  #### Properties ####
  # nrows :: t:Table -> n:Number
  def nrows
    length(rows)
  end

  # ncols :: t:Table -> n:Number
  def ncols
    length(schema.headers)
  end

  # header :: t:Table -> cs:Seq<ColName>
  def header
    schema.headers.map { |h| h[:column_name] }
  end
end