class Row
  attr_reader :schema, :values

  def initialize(schema, values)
    @schema = schema
    @values = values
  end

  def add_header(c)
    @schema.add_header(c)
  end

  def add_value(v)
    @values += [v]
  end

  def duplicate
    Row.new(schema.duplicate, values.dup)
  end
end
