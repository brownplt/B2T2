# Row: an ordered sequence of cells
class Row
  attr_reader :cells

  def initialize(cells)
    @cells = cells
  end

  def add_cell(c)
    @cells += [c]
  end

  def duplicate
    Row.new(cells.dup)
  end
end
